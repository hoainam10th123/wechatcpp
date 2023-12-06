#include "message.h"

Message::Message(const QString &newDisplayName, const QString &newContent)
{
    displayName = newDisplayName;
    content = newContent;
}

QString Message::getDisplayName() const
{
    return displayName;
}

void Message::setDisplayName(const QString &newDisplayName)
{
    displayName = newDisplayName;
}

QString Message::getContent() const
{
    return content;
}

void Message::setContent(const QString &newContent)
{
    content = newContent;
}
