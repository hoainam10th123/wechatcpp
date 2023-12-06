#ifndef CONVERSATION_H
#define CONVERSATION_H

#include <QJsonObject>
#include <QJsonDocument>
#include <QJsonValue>
#include <QString>
#include <QJsonArray>
#include "models/user.h"

class Conversation
{
public:
    Conversation(const QString &id, const QList<User> &users, const QString &messageContent);

//    static Conversation fromJson(const QJsonObject &jsonObject) {
//        int id = jsonObject["id"].toInt();
//        int userId = jsonObject["userId"].toInt();
//        QString body = jsonObject["body"].toString();
//        QString title = jsonObject["title"].toString();
//        return Conversation(id, userId, body, title);
//    }

    static QList<Conversation> convertJsonArrayToList(const QJsonArray &jsonArray){
        QList<Conversation> myObjectList;

        for (const QJsonValue &value : jsonArray) {
            if (value.isObject()) {
                QJsonObject obj = value.toObject();
                QList<User> users;
                QJsonArray usersJsonArray = obj["users"].toArray();
                for (const QJsonValue &value : usersJsonArray) {
                    User usr = User::fromJson(value.toObject());
                    users.append(usr);
                }
                QJsonObject latestMessage = obj["latestMessage"].toObject();
                Conversation myObject(obj["_id"].toString(), users, latestMessage["content"].toString());
                myObjectList.append(myObject);
            }
        }
        return myObjectList;
    }

    QString _id;
    QList<User> users;
    QString messageContent;
};

#endif // CONVERSATION_H
