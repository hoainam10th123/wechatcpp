# wechatcpp - Qt C++ - Nodejs - React
https://www.markdownguide.org/cheat-sheet/
## Install lib
1. Cài đặt [jwt-cpp](https://github.com/Thalhammer/jwt-cpp)
2. Cài đặt [socket.io-client-cpp](https://github.com/socketio/socket.io-client-cpp) 
3. OS target running: Ubuntu

## Using Socket.io C/C++

### emit một string
```cpp
QString lastUserId = "abc"
QByteArray barr = lastUserId.toUtf8();
std::string recipientId(barr.data(),barr.length());
_io->socket()->emit("event name", recipientId);
```
**Server**
```javascript
socket.on("event name", (recipientId) => {
});
```

### emit một object
```cpp
sio::message::ptr msg = sio::object_message::create();
msg->get_map()["userNhan"] = sio::string_message::create(userId);
msg->get_map()["content"] = sio::string_message::create(content);

_io->socket()->emit("send message", msg, [&](sio::message::list const& ack) {
	std::cout << "Acknowledgment received!" << std::endl;
	// Process acknowledgment if needed        
});
```

**Server**
```javascript
socket.on("send message", async (data) => {
	const { content, userNhan } = data
});
```

### listen event from server trả về là một object
```cpp
_io->socket()->on("NewMessage", [&](sio::event& ev)
  {
	std::string msg = ev.get_message()->get_map()["content"]->get_string();
	std::string senderName = ev.get_message()->get_map()["sender"]->get_map()["displayName"]->get_string();
	qDebug() <<"NewMessage: "<< msg << "Name: " << senderName;
	Message mess(QString::fromStdString(senderName), QString::fromStdString(msg));
	Q_EMIT NewMessage(mess);
  });
```

### listen event from server trả về là một array (list)

**user model**
```javascript
export interface IUser{
    _id: string;
    displayName: string;
    email: string;
    picture: string;
    status: string;
    createdAt: Date;
    lastActive: Date;
} 
```

**message model**
```javascript
export interface IMessage{
    _id: string;
    sender: IUser;
    recipient: IUser;
    content: string;
    dateRead: Date;
    messageSent: Date;
    files: any[];
    createdAt: Date;
    updatedAt: Date;
} 
```

```cpp
_io->socket()->on("receive all message", [&](sio::event& ev)
{
	QList<Message> listMess;
	std::vector<std::shared_ptr<sio::message>>& arrayMess = ev.get_message()->get_vector();
	for (const auto& element : arrayMess) {
		auto messageId = element->get_map()["_id"]->get_string();
		auto content = element->get_map()["content"]->get_string();
		auto senderName = element->get_map()["sender"]->get_map()["displayName"]->get_string();
		//std::cout << "UserId: " << userId << std::endl;
		qDebug()<< "senderName" <<senderName;
		qDebug()<< "Noi dung: " <<content;
		Message mess(QString::fromStdString(senderName), QString::fromStdString(content));
		listMess.append(mess);
	}
	// render message item
	Q_EMIT loadMessagesItem(listMess);
});
```