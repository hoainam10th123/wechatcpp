#ifndef USERRESPONSE_H
#define USERRESPONSE_H

#include <QString>
#include "user.h"

class UserResponse
{
public:
    UserResponse(const QString &token, const User &user);

    static UserResponse fromJson(const QJsonObject &jsonObject) {
        User user = User::fromJson(jsonObject["user"].toObject());
        QString token = jsonObject["token"].toString();
        return UserResponse(token, user);
    }

    QString getToken() const;

    User getUser() const;
    void setUser(const User &newUser);

private:
    QString token;
    User user;
};

#endif // USERRESPONSE_H
