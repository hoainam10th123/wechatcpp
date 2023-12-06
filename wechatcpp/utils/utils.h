#ifndef UTILS_H
#define UTILS_H

#include <jwt-cpp/jwt.h>
#include <iostream>

class Utils
{
public:
    Utils();

    static int getHeightListWidgetItem(){
        return 70;
    };

    static int getHeightListWidgetMessItem(){
        return 90;
    };

    static std::string decodedJwtUserId(std::string token){
        auto decoded = jwt::decode(token);

        for(auto& e : decoded.get_payload_json()){
            std::cout << e.first << " = " << e.second << std::endl;
            if(e.first.compare("userId") == 0){
                return e.second.to_str();
            }
        }
        return "";
    };
};

#endif // UTILS_H
