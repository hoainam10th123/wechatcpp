#ifndef INFORDIALOG_H
#define INFORDIALOG_H

#include <QDialog>

namespace Ui {
class InforDialog;
}

class InforDialog : public QDialog
{
    Q_OBJECT

public:
    explicit InforDialog(QWidget *parent = nullptr);
    ~InforDialog();

private Q_SLOTS:
    void on_pushButtonClose_clicked();

private:
    Ui::InforDialog *ui;
};

#endif // INFORDIALOG_H
