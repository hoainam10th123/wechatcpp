QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets
QT += network

CONFIG += no_keywords
CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    infordialog.cpp \
    main.cpp \
    models/conversation.cpp \
    models/message.cpp \
    utils/utils.cpp \
    widget.cpp \
    commonwidget/customcontactwidget.cpp \
    commonwidget/circularavatar.cpp \
    commonwidget/messageitem.cpp \
    commonwidget/popup.cpp \
    models/user.cpp \
    models/userresponse.cpp

HEADERS += \
    infordialog.h \
    models/conversation.h \
    models/message.h \
    utils/utils.h \
    widget.h \
    commonwidget/customcontactwidget.h \
    commonwidget/circularavatar.h \
    commonwidget/messageitem.h \
    commonwidget/popup.h \
    models/user.h \
    models/userresponse.h

FORMS += \
    infordialog.ui \
    widget.ui

INCLUDEPATH += $$PWD/../../../build/include
DEPENDPATH += $$PWD/../../../build/lib

CONFIG(release, debug|release): LIBS += -L$$PWD/../../../build/lib/Release/ -lsioclient
else:CONFIG(debug, debug|release): LIBS += -L$$PWD/../../../build/lib/Debug/ -lsioclient

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

RESOURCES += \
    resource.qrc
