#ifndef MESSAGE_H
#define MESSAGE_H

#include <QString>

class Message
{
public:
    Message(const QString &newDisplayName, const QString &newContent);

    QString getDisplayName() const;
    void setDisplayName(const QString &newDisplayName);

    QString getContent() const;
    void setContent(const QString &newContent);

private:
    QString displayName;
    QString content;
};

#endif // MESSAGE_H
