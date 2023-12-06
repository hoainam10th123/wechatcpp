#include "circularavatar.h"
#include <QPixmap>
#include <QPainter>
#include <QBitmap>

CircularAvatar::CircularAvatar(QWidget *parent, const QString &imgUrl, const int &w, const int &h) : QLabel(parent) {
    setFixedSize(w, h); // Set the size of the circular avatar
    QPixmap image(imgUrl);
    setPixmap(createCircularPixmap(image));
    setScaledContents(true); // Maintain the aspect ratio of the image
    setAlignment(Qt::AlignCenter);
}

QPixmap CircularAvatar::createCircularPixmap(const QPixmap &sourcePixmap) {
    // Create a circular mask
    QBitmap mask(sourcePixmap.size());
    mask.fill(Qt::color0); // Transparent

    QPainter painter(&mask);
    painter.setBrush(Qt::color1); // Opaque
    painter.setRenderHint(QPainter::Antialiasing, true);
    painter.drawEllipse(0, 0, mask.width(), mask.height());

    // Apply the circular mask to the source image
    QPixmap circularPixmap = sourcePixmap;
    circularPixmap.setMask(mask);

    return circularPixmap;
}
