#include "customcontactwidget.h"
#include <QStackedWidget>
#include <QVBoxLayout>
#include <QTimer>
#include "utils/utils.h"

CustomContactWidget::CustomContactWidget(QWidget *parent, const QString &displayName, const QString &content)
    : QWidget{parent}
{
    setUserName(displayName);
    hLayoutContact = new QHBoxLayout();
    avatar = new CircularAvatar(this, ":/img/user.png", 60,60);
    onlineAvatar = new CircularAvatar(avatar, ":img/online.png", 20,20);
    onlineAvatar->move(42, 37);

    QVBoxLayout * vlayoutName = new QVBoxLayout();
    QLabel * name = new QLabel(displayName);
    QFont nameFont, commonFont;
    nameFont.setWeight(QFont::Bold);
    nameFont.setPointSize(14);
    commonFont.setPointSize(11);
    name->setFont(nameFont);


    QLabel * status = new QLabel(content);
    vlayoutName->addWidget(name);
    vlayoutName->addWidget(status);
    status->setStyleSheet("color: gray;");
    status->setFont(commonFont);

    QLabel * agoTime = new QLabel("now");
    agoTime->setFont(commonFont);
    agoTime->setStyleSheet("color: gray;");


    hLayoutContact->addWidget(avatar);
    hLayoutContact->addLayout(vlayoutName);
    hLayoutContact->addWidget(agoTime);

    setLayout(hLayoutContact);
    setFixedHeight(Utils::getHeightListWidgetItem());
    setOnline(false);// defaut is offline
}

CustomContactWidget::~CustomContactWidget()
{
    delete onlineAvatar;
    delete avatar;
    delete hLayoutContact;
}

QString CustomContactWidget::getUserName() const
{
    return userId;
}

void CustomContactWidget::setUserName(const QString &newUserName)
{
    userId = newUserName;
}

void CustomContactWidget::setOnline(bool status){
    this->onlineAvatar->setVisible(status);
}
