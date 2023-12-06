#include "infordialog.h"
#include "ui_infordialog.h"

InforDialog::InforDialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::InforDialog)
{
    ui->setupUi(this);
}

InforDialog::~InforDialog()
{
    delete ui;
}

void InforDialog::on_pushButtonClose_clicked()
{    
    reject();
}

