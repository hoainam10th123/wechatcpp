#include "messageitem.h"
#include <QVBoxLayout>

MessageItem::MessageItem(QWidget *parent, const QString &name, const QString &noiDung)
    : QWidget{parent}
{
    displayName = new QLabel();
    content = new QLabel();
    QVBoxLayout* vbox = new QVBoxLayout(this);
    this->displayName->setText(name);
    this->displayName->setStyleSheet("color: rgb(8, 62, 255); font: 700 16pt Segoe UI;");
    this->content->setText(noiDung);
    this->content->setStyleSheet("font-size:16px;");
    this->content->setWordWrap(true);
    vbox->addWidget(this->displayName);
    vbox->addWidget(this->content);
    setLayout(vbox);
}

MessageItem::~MessageItem()
{
    delete displayName;
    delete content;
}
