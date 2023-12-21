#ifndef WIDGET_H
#define WIDGET_H
#include <sio_client.h>
#include <QWidget>
#include <QMessageBox>
#include <QListWidgetItem>
#include "commonwidget/popup.h"
#include "models/user.h"
#include <QMutex>
#include <QNetworkAccessManager>
#include "models/conversation.h"
#include "models/message.h"
#include <QTimer>
//using namespace sio;

QT_BEGIN_NAMESPACE
namespace Ui { class Widget; }
QT_END_NAMESPACE



class Widget : public QWidget
{
    Q_OBJECT

public:
    Widget(QWidget *parent = nullptr);
    ~Widget();

Q_SIGNALS:
    void ResizeWidget();
    void userOnline(const User& user);
    void userOffline(const User& user);
    void loadMessagesItem(const QList<Message>& listMess);
    void NewMessage(const Message& message);
    void AddTyping();
    void RemoveTyping();

public Q_SLOTS:
    void onTimeout();


private Q_SLOTS:
    void on_lineEditEmail_textChanged(const QString &arg1);

    void on_pushButton_clicked();

    void onResizeWidget();

    void on_pushButtonLogout_clicked();

    void on_listWidgetContact_itemClicked(QListWidgetItem *item);

    void on_lineEditContent_returnPressed();

    void on_pushButtonAbout_clicked();

    void on_user_online(const User& user);

    void on_user_offline(const User& user);

    void dataReadyToRead();

    void dataReadFinished();

    void onLoadMessagesItem(const QList<Message>& listMess);

    void onNewMessage(const Message& message);


    void on_lineEditContent_textChanged(const QString &arg1);

    void onAddTyping();

    void onRemoveTyping();

private:
    void clearListItem();
    void createSocket();
    void loadConversation();
    User findUserByUserId(const QString& userId);
    QListWidgetItem* findItem(const QString& key);
    void renderContact(const QList<Conversation>& convs);
    Ui::Widget *ui;
    Popup *popUp;
    std::unique_ptr<sio::client> _io;
    QList<User> usersOnline;
    QList<QListWidgetItem*> usersOnlineItems;
    QMutex mutex;
    QNetworkAccessManager * net_manager;
    QNetworkReply * net_reply;
    QByteArray * m_data_buffer;
    QString token, serverIp;
    QString selectedUserId="";
    QTimer* timer;
    bool typeing = false;
    QListWidgetItem *typingItem = nullptr;
    QTime lastTypeing;
};
#endif // WIDGET_H
