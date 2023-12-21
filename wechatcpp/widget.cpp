#include "widget.h"
#include "ui_widget.h"
#include <QMessageBox>
#include <QStyle>
#include <iostream>
#include <memory>
#include <sstream>
#include <QRegularExpression>
#include <QRegularExpressionValidator>
#include "commonwidget/customcontactwidget.h"
#include "utils/utils.h"
#include "commonwidget/messageitem.h"
#include "infordialog.h"
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>
#include <QUrlQuery>
#include <QMessageBox>
#include "utils/utils.h"
#include <string>
#include <QSettings>

Widget::Widget(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Widget)
{
    ui->setupUi(this);
    popUp = new Popup(this);
    //Initialization
    net_manager =  new QNetworkAccessManager(this);
    net_reply = nullptr;
    m_data_buffer = new QByteArray();

    //load token from storage
    QSettings settings("AGU","SettingToken");
    settings.beginGroup("StoreToken");
    token = settings.value("token",QVariant("")).toString();
    serverIp = settings.value("server",QVariant("localhost:8000")).toString();
    settings.endGroup();
    if(token != ""){
        // chat home page
        createSocket();
        loadConversation();
        ui->stackedWidget->setCurrentIndex(1);
    }else{
        // login page
        ui->stackedWidget->setCurrentIndex(0);
    }

    timer = new QTimer(this);
    timer->setSingleShot(true);// run 1 lan

    QRegularExpression rx("\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}\\b", QRegularExpression::CaseInsensitiveOption);
    ui->lineEditEmail->setValidator(new QRegularExpressionValidator(rx, this));

    connect(this, &Widget::userOnline, this, &Widget::on_user_online);
    connect(this, &Widget::userOffline, this, &Widget::on_user_offline);
    connect(this, &Widget::loadMessagesItem, this, &Widget::onLoadMessagesItem);
    connect(this, &Widget::NewMessage, this, &Widget::onNewMessage);
    connect(this, &Widget::AddTyping, this, &Widget::onAddTyping);
    connect(this, &Widget::RemoveTyping, this, &Widget::onRemoveTyping);
    connect(timer,SIGNAL(timeout()),this,SLOT(onTimeout()));
}

Widget::~Widget()
{
    _io->socket()->off_all();
    _io->socket()->off_error();
    usersOnline.clear();
    usersOnlineItems.clear();
    delete m_data_buffer;    
    delete ui;
}

void Widget::onAddTyping(){
    if(typingItem == nullptr){
        typingItem = new QListWidgetItem();
        typingItem->setText("Typing ...");
        ui->listWidgetMessages->addItem(typingItem);
    }
}

void Widget::onRemoveTyping(){
    int row = ui->listWidgetMessages->row(typingItem);
    delete ui->listWidgetMessages->takeItem(row);
    typingItem = nullptr;
}

void Widget::onLoadMessagesItem(const QList<Message>& listMess){
    ui->listWidgetMessages->clear();
    for (const auto& element : listMess) {
        QSize sizeMess(1, Utils::getHeightListWidgetMessItem());
        MessageItem *message = new MessageItem(nullptr, element.getDisplayName(), element.getContent());
        QListWidgetItem *item = new QListWidgetItem(ui->listWidgetMessages);
        // disable select item
        item->setFlags(item->flags() & ~Qt::ItemIsEnabled);
        item->setSizeHint(sizeMess);
        ui->listWidgetMessages->setItemWidget(item, message);
        ui->listWidgetMessages->addItem(item);
    }
    // Scroll to the last item
    QListWidgetItem *lastItem = ui->listWidgetMessages->item(ui->listWidgetMessages->count() - 1);
    if (lastItem) {
        ui->listWidgetMessages->scrollToItem(lastItem);
    }
}

void Widget::loadConversation()
{
    const QString server = "http://"+serverIp;
    m_data_buffer->clear();
    const QUrl API_ENDPOINT(server+"/api/v1/conversations");
    QNetworkRequest request;
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader("Authorization", QByteArray("Bearer " + token.toUtf8()));
    request.setUrl(API_ENDPOINT);

    net_reply = net_manager->get(request);
    connect(net_reply,&QIODevice::readyRead,this,&Widget::dataReadyToRead);
    connect(net_reply,&QNetworkReply::finished,this,&Widget::dataReadFinished);
}

void Widget::dataReadyToRead()
{
    qDebug()<< "Some data available";
    m_data_buffer->append(net_reply->readAll());
}

void Widget::dataReadFinished()
{
    if(net_reply->error())
    {
        qDebug() << "Error : " << net_reply->errorString();
        QMessageBox::critical(this, "Error Get Conversation", net_reply->errorString());
    }else
    {
        //qDebug() << "Data fetch finished : " << QString(*m_data_buffer);
        QJsonDocument doc = QJsonDocument::fromJson(*m_data_buffer);
        QJsonArray array = doc.array();
        QList<Conversation> convs = Conversation::convertJsonArrayToList(array);

        renderContact(convs);        

//        for ( int i = 0; i < array.size(); i++)
//        {
//            QJsonObject object = array.at(i).toObject();
//            QVariantMap map = object.toVariantMap();
//            QString title = map["_id"].toString();
//        }
    }
}

void Widget::renderContact(const QList<Conversation>& convs){
    QSize size(ui->listWidgetContact->width(), Utils::getHeightListWidgetItem());

    for(int i = 0; i < convs.size(); i++){
        QString currentUserId = QString::fromStdString(Utils::decodedJwtUserId(token.toStdString()));
        auto senderUser = currentUserId == convs[i].users.at(0).id() ? convs[i].users.at(1) : convs[i].users.at(0);
        CustomContactWidget *user = new CustomContactWidget(nullptr, senderUser.getDisplayName(), convs[i].messageContent);
        QListWidgetItem *item = new QListWidgetItem(ui->listWidgetContact);
        // save user json object
        item->setData(Qt::UserRole, QVariant(senderUser.toJson()));
        item->setSizeHint(size);
        usersOnlineItems.append(item);
        ui->listWidgetContact->setItemWidget(item, user);
        ui->listWidgetContact->addItem(item);
    }    
}

void Widget::createSocket(){
    _io = std::unique_ptr<sio::client>(new sio::client());
    // khoi tao socket.io
    std::map<std::string, std::string> query;
    query["token"] = token.toStdString();

    const QString server = "http://"+serverIp; // http://localhost:8000
    _io->connect(server.toStdString(), query);

    _io->socket()->on("UserIsOnline", [&](sio::event& ev)
      {
          std::ostringstream url;
          std::string displayName = ev.get_message()->get_map()["displayName"]->get_string();
          std::string userId = ev.get_message()->get_map()["_id"]->get_string();
          User user;
          user.setDisplayName(QString::fromStdString(displayName));
          user.setId(QString::fromStdString(userId));
          url << displayName << "is online";
          qDebug() << url.str();
          mutex.lock();
          Q_EMIT userOnline(user);
          mutex.unlock();
          qDebug() << "chieu dai cua mang: " <<usersOnline.length();
      });

    _io->socket()->on("UserIsOffline", [&](sio::event& ev)
      {
          std::ostringstream url;
          std::string displayName = ev.get_message()->get_map()["displayName"]->get_string();
          std::string userId = ev.get_message()->get_map()["_id"]->get_string();
          url << displayName << "is offline";
          qDebug() << url.str();
          User user;
          user.setDisplayName(QString::fromStdString(displayName));
          user.setId(QString::fromStdString(userId));

          mutex.lock();
          Q_EMIT userOffline(user);
          mutex.unlock();
          qDebug() <<"chieu dai cua mang: " <<usersOnline.length();
      });

    _io->socket()->on("GetOnlineUsers", [&](sio::event& ev)
      {
        mutex.lock();
        usersOnline.clear();
        const auto& array = ev.get_message()->get_vector();

        for (const auto& element : array) {
            auto userId = element->get_map()["_id"]->get_string();
            auto displayName = element->get_map()["displayName"]->get_string();
            //std::cout << "UserId: " << userId << std::endl;
            qDebug() << "User ID: " << userId;
            qDebug() << "DisplayName: " << displayName;
            User user;
            user.setId(QString::fromStdString(userId));
            user.setDisplayName(QString::fromStdString(displayName));
            usersOnline.append(user);
        }

        // set online user contact
        for(const auto &user : usersOnline){
            auto itemUser = findItem(user.id());
            if(itemUser != nullptr){
                CustomContactWidget* contactWidget = (CustomContactWidget*) ui->listWidgetContact->itemWidget(itemUser);
                contactWidget->setOnline(true);
            }
        }
        mutex.unlock();
      });

    _io->socket()->on("NewMessage", [&](sio::event& ev)
      {
        std::string msg = ev.get_message()->get_map()["content"]->get_string();
        std::string senderName = ev.get_message()->get_map()["sender"]->get_map()["displayName"]->get_string();
        qDebug() <<"NewMessage: "<< msg << "Name: " << senderName;
        Message mess(QString::fromStdString(senderName), QString::fromStdString(msg));
        Q_EMIT NewMessage(mess);
      });

    _io->socket()->on("receive all message", [&](sio::event& ev)
    {
        QList<Message> listMess;
        std::vector<std::shared_ptr<sio::message>>& arrayMess = ev.get_message()->get_vector();
        for (const auto& element : arrayMess) {
            auto messageId = element->get_map()["_id"]->get_string();
            auto content = element->get_map()["content"]->get_string();
            auto senderName = element->get_map()["sender"]->get_map()["displayName"]->get_string();
            //std::cout << "UserId: " << userId << std::endl;
            qDebug()<< "senderName" <<senderName;
            qDebug()<< "Noi dung: " <<content;
            Message mess(QString::fromStdString(senderName), QString::fromStdString(content));
            listMess.append(mess);
        }
        // render message item
        Q_EMIT loadMessagesItem(listMess);
    });

    _io->socket()->on("typing", [&](sio::event& ev)
    {
        Q_EMIT AddTyping();
    });

    _io->socket()->on("stop typing", [&](sio::event& ev)
    {
        timer->stop();
        Q_EMIT RemoveTyping();
    });
}

void Widget::onNewMessage(const Message& message){
    QSize sizeMess(1, Utils::getHeightListWidgetMessItem());
    MessageItem *messageItem = new MessageItem(nullptr, message.getDisplayName(), message.getContent());

    QListWidgetItem *item = new QListWidgetItem(ui->listWidgetMessages);
    // disable select item
    item->setFlags(item->flags() & ~Qt::ItemIsEnabled);
    item->setSizeHint(sizeMess);    
    ui->listWidgetMessages->setItemWidget(item, messageItem);
    ui->listWidgetMessages->addItem(item);

    // Scroll to the last item
    QListWidgetItem *lastItem = ui->listWidgetMessages->item(ui->listWidgetMessages->count() - 1);
    if (lastItem) {
        ui->listWidgetMessages->scrollToItem(lastItem);
    }
}

QListWidgetItem* Widget::findItem(const QString& key){
    for (QListWidgetItem* userItem : usersOnlineItems) {
        if(userItem->data(Qt::UserRole).toJsonObject()["_id"].toString() == key){
            return userItem;
        }
    }
    return nullptr;
}

//update UI
void Widget::on_user_online(const User& user){
    usersOnline.append(user);

    auto itemUser = findItem(user.id());
    if(itemUser != nullptr){
        CustomContactWidget* contactWidget = (CustomContactWidget*) ui->listWidgetContact->itemWidget(itemUser);
        contactWidget->setOnline(true);
    }    
    //show popup
    popUp->setPopupText("NOTIFICATION\n"+user.getDisplayName() + " online");
    popUp->show();
}

void Widget::on_user_offline(const User& user){
    usersOnline.removeOne(user);
    auto itemUser = findItem(user.id());
    if(itemUser != nullptr){
        CustomContactWidget* contactWidget = (CustomContactWidget*) ui->listWidgetContact->itemWidget(itemUser);
        contactWidget->setOnline(false);
    }
    // show popup
    popUp->setPopupText("NOTIFICATION\n"+user.getDisplayName() + " offline");
    popUp->show();
}

void Widget::clearListItem(){
    ui->listWidgetContact->clear();
    ui->listWidgetMessages->clear();
}

// khong dung den
void Widget::onResizeWidget()
{
    //resize(600, 400);
}


void Widget::on_lineEditEmail_textChanged(const QString &arg1)
{
    qDebug() << arg1;
    if(!ui->lineEditEmail->hasAcceptableInput())
        ui->lineEditEmail->setStyleSheet("QLineEdit { color: red;}");
    else
        ui->lineEditEmail->setStyleSheet("QLineEdit { color: black;}");
}

//login button
void Widget::on_pushButton_clicked()
{
    //QString email = ui->lineEditEmail->text();
    //QString password = ui->lineEditPassword->text();
    if(!ui->lineEditEmail->hasAcceptableInput()){
        QMessageBox::warning(this, tr("Email verification"), tr("Email format is incorrect."), QMessageBox::Ok);
    }else{
        token = ui->textEditToken->toPlainText();
        serverIp = ui->lineEditServerIp->text();
        createSocket();
        loadConversation();
        QSettings settings("AGU","SettingToken");
        settings.beginGroup("StoreToken");
        settings.setValue("token",token);
        settings.setValue("server",serverIp);
        settings.endGroup();
        // change to chat home page
        ui->stackedWidget->setCurrentIndex(1);
    }
}

void Widget::on_pushButtonLogout_clicked()
{
    usersOnlineItems.clear();
    usersOnline.clear();
    ui->listWidgetContact->clear();
    ui->listWidgetMessages->clear();
    _io->socket()->off_all();
    _io->socket()->off_error();
    _io->socket()->close();
    //Set LocalStorage
    token = "";
    QSettings settings("AGU","SettingToken");
    settings.beginGroup("StoreToken");
    settings.setValue("token",token);
    settings.endGroup();
    // change to login page
    ui->stackedWidget->setCurrentIndex(0);
}

void Widget::on_listWidgetContact_itemClicked(QListWidgetItem *item)
{
    QJsonObject userJson = item->data(Qt::UserRole).toJsonObject();
    qDebug() << "You select " + userJson["displayName"].toString();
    ui->labelDisplayName->setText(userJson["displayName"].toString());

    const User user = findUserByUserId(userJson["_id"].toString());
    if(user.id() != ""){
        ui->labelStatus->setText("Online");
    }else{
        ui->labelStatus->setText("Offline");
    }
    if(selectedUserId != ""){
        const QString lastUserId = selectedUserId;
        // create connect socket conversation for chat
        QByteArray barr = lastUserId.toUtf8();
        std::string tempUserId(barr.data(),barr.length());
        _io->socket()->emit("leaveRoom", tempUserId);
    }
    selectedUserId = userJson["_id"].toString();
    // create connect socket conversation for chat
    QByteArray bytes = selectedUserId.toUtf8();
    std::string userId(bytes.data(),bytes.length());
    _io->socket()->emit("join conversation", userId);
}

User Widget::findUserByUserId(const QString& userId){
    User temp;
    for(const User &user: usersOnline){
        if(user.id() == userId)
            return user;
    }
    return temp;
}

void Widget::on_lineEditContent_returnPressed()
{
    std::string userId = selectedUserId.toStdString();
    std::string content = ui->lineEditContent->text().toStdString();

    qDebug() << "enter press keyboard in line edit";
    sio::message::ptr msg = sio::object_message::create();
    msg->get_map()["userNhan"] = sio::string_message::create(userId);
    msg->get_map()["content"] = sio::string_message::create(content);

    _io->socket()->emit("send message", msg, [&](sio::message::list const& ack) {
        std::cout << "Acknowledgment received!" << std::endl;
        // Process acknowledgment if needed        
    });
    ui->lineEditContent->setText("");
}

void Widget::on_pushButtonAbout_clicked()
{
    InforDialog *about = new InforDialog(this);
    about->exec();
}

void Widget::on_lineEditContent_textChanged(const QString &arg1)
{
    //qDebug() << arg1;
    if(!typeing) {
        typeing = true;
        std::string recipientId = selectedUserId.toStdString();
        _io->socket()->emit("typing", recipientId);
    }
    lastTypeing = QDateTime::currentDateTime().time();
    timer->start(2000);
}

void Widget::onTimeout(){
    const auto timeNow = QDateTime::currentDateTime().time();
    int secondsDifference = lastTypeing.secsTo(timeNow);
    qDebug()<< "so giay: " << secondsDifference;
    if(secondsDifference >= 2 && typeing) {
        std::string recipientId = selectedUserId.toStdString();
        _io->socket()->emit("stop typing", recipientId);
        typeing = false;
    }
}
