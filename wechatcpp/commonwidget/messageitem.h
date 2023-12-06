#ifndef MESSAGEITEM_H
#define MESSAGEITEM_H

#include <QWidget>
#include <QLabel>

class MessageItem : public QWidget
{
    Q_OBJECT
public:
    explicit MessageItem(QWidget *parent = nullptr, const QString &displayName="", const QString &content="");
    ~MessageItem();

Q_SIGNALS:

private:
    QLabel * displayName;
    QLabel * content;
};

#endif // MESSAGEITEM_H
