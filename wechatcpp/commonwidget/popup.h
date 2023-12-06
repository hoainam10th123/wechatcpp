#ifndef POPUP_H
#define POPUP_H

#include <QWidget>
#include <QLabel>
#include <QGridLayout>
#include <QPropertyAnimation>
#include <QTimer>

class Popup : public QWidget
{
    Q_OBJECT

    Q_PROPERTY(float popupOpacity READ getPopupOpacity WRITE setPopupOpacity)

public:
    explicit Popup(QWidget *parent = nullptr);
    void setPopupOpacity(float opacity);
    float getPopupOpacity() const;

Q_SIGNALS:

protected:
    void paintEvent(QPaintEvent *event);

public Q_SLOTS:
    void setPopupText(const QString& text); // Setting text notification
    void show();

private Q_SLOTS:
    void hideAnimation();
    void hide();

private:
    QLabel label;
    QGridLayout layout;
    QPropertyAnimation animation;
    float popupOpacity;
    QTimer *timer;
};

#endif // POPUP_H
