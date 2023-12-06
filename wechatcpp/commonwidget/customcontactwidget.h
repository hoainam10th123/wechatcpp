#ifndef CUSTOMCONTACTWIDGET_H
#define CUSTOMCONTACTWIDGET_H

#include <QHBoxLayout>
#include <QWidget>
#include "circularavatar.h"
#include <QDebug>

class CustomContactWidget : public QWidget
{
    Q_OBJECT
public:
    explicit CustomContactWidget(QWidget *parent = nullptr, const QString &displayName="", const QString &content="");
    ~CustomContactWidget();

    QString getUserName() const;
    void setUserName(const QString &newUserName);
    void setOnline(bool status);

    QString getContentMessage() const;
    void setContentMessage(const QString &newContentMessage);

Q_SIGNALS:

private Q_SLOTS:
    //void handleTimeout();

private:
    CircularAvatar * onlineAvatar;
    CircularAvatar * avatar;
    QString userId;
    QHBoxLayout * hLayoutContact;
};

#endif // CUSTOMCONTACTWIDGET_H
