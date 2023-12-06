#ifndef CIRCULARAVATAR_H
#define CIRCULARAVATAR_H
#include <QLabel>

class CircularAvatar : public QLabel
{

public:
    CircularAvatar(QWidget *parent = nullptr, const QString &imgUrl="", const int &w=1, const int &h=1);

private:
    QPixmap createCircularPixmap(const QPixmap &sourcePixmap);
};

#endif // CIRCULARAVATAR_H
