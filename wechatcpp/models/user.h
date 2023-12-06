#ifndef USER_H
#define USER_H

#include <QJsonObject>
#include <QJsonDocument>
#include <QJsonValue>
#include <QString>
#include <QJsonArray>


class User
{
public:
    User();

    User(const QString &id,
         const QString &displayName,
         const QString &email,
         const QString &picture,
         const QString &status,
         const QDateTime &createdAt,
         const QDateTime &lastActive);

    bool operator==(const User& other) const;

    QJsonObject toJson() const;

    static User fromJson(const QJsonObject &jsonObject) {
        QString id = jsonObject["_id"].toString();
        QString displayName = jsonObject["displayName"].toString();
        QString email = jsonObject["email"].toString();
        QString picture = jsonObject["picture"].toString();
        QString status = jsonObject["status"].toString();
        QDateTime createdAt = QDateTime::fromString(jsonObject["createdAt"].toString(), "yyyy-MM-ddTHH:mm:ss.zzzZ");
        QDateTime lastActive = QDateTime::fromString(jsonObject["lastActive"].toString(), "yyyy-MM-ddTHH:mm:ss.zzzZ");
        return User(id, displayName, email, picture, status, createdAt, lastActive);
    }


    QString id() const;

    QString getDisplayName() const;

    QString getEmail() const;

    QString getPicture() const;

    QString getStatus() const;

    QDateTime getCreatedAt() const;

    QDateTime getLastActive() const;

    void setId(const QString &newId);

    void setDisplayName(const QString &newDisplayName);

private:
    QString _id;
    QString displayName;
    QString email;
    QString picture;
    QString status;
    QDateTime createdAt;
    QDateTime lastActive;
};

#endif // USER_H
