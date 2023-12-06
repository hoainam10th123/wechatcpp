#include "userresponse.h"

UserResponse::UserResponse(const QString &token, const User &user)
{
    this->token = token;
    this->user = user;
}

QString UserResponse::getToken() const
{
    return token;
}

User UserResponse::getUser() const
{
    return user;
}

void UserResponse::setUser(const User &newUser)
{
    user = newUser;
}
