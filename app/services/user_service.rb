class UserService
    def initialize(controller = false)
        @controller = controller
    end

    def before_save_doctor(data, flag = false)

        nameArr = data[:full_name].split(' ')
      
        if nameArr.count > 0
            data[:first_name] = nameArr[0]
            nameArr.delete(nameArr[0])
            data[:last_name] = nameArr.join(" ")
        end
        
        data = data.merge({
            status: 'active',
            position: 'doctor',
        })

        unless flag
            data = data.merge({
                registered_at: DateTime.now,
                encrypted_password: BCrypt::Password.create(data[:password]),
            })
        end
        return data
    end
end