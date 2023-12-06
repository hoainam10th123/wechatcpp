#include "user.h"


User::User()
{
    this->_id = "";
    this->displayName = "displayName";
    this->email = "email";
    this->picture = "picture";
    this->status = "status";
}

User::User(const QString &id,
           const QString &displayName,
           const QString &email,
           const QString &picture,
           const QString &status,
           const QDateTime &createdAt,
           const QDateTime &lastActive)
{
    this->_id = id;
    this->displayName = displayName;
    this->email = email;
    this->picture = picture;
    this->status = status;
    this->createdAt = createdAt;
    this->lastActive = lastActive;
}

QString User::id() const
{
    return _id;
}

QString User::getDisplayName() const
{
    return displayName;
}

QString User::getEmail() const
{
    return email;
}

QString User::getPicture() const
{
    return picture;
}

QString User::getStatus() const
{
    return status;
}

QDateTime User::getCreatedAt() const
{
    return createdAt;
}

QDateTime User::getLastActive() const
{
    return lastActive;
}

void User::setId(const QString &newId)
{
    _id = newId;
}

void User::setDisplayName(const QString &newDisplayName)
{
    displayName = newDisplayName;
}

bool User::operator==(const User& other) const {
    return _id == other._id;
}

QJsonObject User::toJson() const {
    QJsonObject jsonObject;
    jsonObject["_id"] = _id;
    jsonObject["displayName"] = displayName;
    jsonObject["email"] = email;
    jsonObject["picture"] = picture;
    return jsonObject;
}
