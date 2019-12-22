require 'bcrypt'
class AuthService
  def initialize(controller = false)
    @controller = controller
  end

  def redirectHome(position = false, inline = false)
    if inline
      case position
      when 'admin' || 'hospital'
        return @controller.admissions_path
      when 'user'
        return @controller.registrations_path
      end
    else
      case position
      when 'admin' || 'hospital'
        redirect_to(@controller.admissions_path)
      when 'user'
        redirect_to(@controller.registrations_path)
      end
    end
  end

  def switch_menu(position = false)
    case position
    when 'admin'
      result = [
        {
          'actived': 'admission',
          'label': 'Pendaftaran',
          'url': @controller.admissions_path,
          'prm_icon': 'prm-chart',
        }, 
        {
          'actived': 'schedule',
          'label': 'Jadwal Dokter',
          'url': @controller.schedules_path,
          'prm_icon': 'prm-chart',
        },  
        {
          'actived': 'hospital',
          'label': 'Rumah Sakit',
          'prm_icon': 'prm-chart',
          'childs': [
            {
              'actived': 'build',
              'label': 'Rumah Sakit',
              'url': @controller.hospitals_path,
            },
            {
              'actived': 'poli',
              'label': 'Poli',
              'url': @controller.polis_path,
            },
            {
              'actived': 'room',
              'label': 'Ruangan',
              'url': @controller.rooms_path,
            },
            {
              'actived': 'assign-doctor',
              'label': 'Penugasan Dokter',
              'url': @controller.assign_doctors_path,
            },
          ]
        },
        {
          'actived': 'user',
          'label': 'User',
          'url': '#',
          'prm_icon': 'prm-chart',
          'childs': [
            {
              'actived': 'client',
              'label': 'Pelanggan',
              'url': @controller.clients_path,
            },
            {
              'actived': 'doctor',
              'label': 'Dokter',
              'url': @controller.doctors_path,
            }
          ]
        },
      ]
    when 'user'
      result = [
        {
          'actived': 'registration',
          'label': 'Regis Pasien',
          'url': @controller.registrations_path,
          'prm_icon': 'prm-chart',
        }, 
      ]
    end
    return result
  end

  def authorized(data)
    email  = data[:email] || nil
    password  = data[:password] || nil

    user = User.find_by("
      LOWER(users.email) = '#{email.downcase}' AND users.status = 'active'")

    result = {
      'status': 'error',
      'msg': 'Gagal melakukan login, username atau password Anda tidak valid',
    }

    if user.present?
      # if user.authenticate(password)
        @controller.session[:user] = user
        redirect = redirectHome(user.position, true)
        result = {
          'status': 'success',
          'msg': 'Anda berhasil login, silakan beraktivitas',
          'redirect': redirect
        }
      # end
    end
    return result
  end

  def encryptPassword(data, attributes = {})
    sourceField = attributes[:sourceField].present? ? attributes[:sourceField] : false
    destinationField = attributes[:destinationField].present? ? attributes[:destinationField] : false
    
    if sourceField.present? && destinationField.present?
      nameArr = data[:full_name].split(' ')
      
      if nameArr.count > 0
        data[:first_name] = nameArr[0]
        nameArr.delete(nameArr[0])
        data[:last_name] = nameArr.join(" ")
      end

      data[destinationField] = BCrypt::Password.create(data[sourceField])
      data = data.merge({
        status: 'active',
        position: 'user',
        registered_at: DateTime.now,
      })
    end
    return data
  end

  def authentication
    user = defined?(@controller.session[:user]) ? @controller.session[:user] : false
    action = @controller.params[:action]
    controller = @controller.params[:controller]
    saml = @controller.params['SAMLResponse']

    if user.present?
      return user
    elsif saml.present?
      return 'auth_provider'
    else
      if action != 'login' && controller != 'auth'
        @controller.redirect_to(@controller.login_path)
      end
    end
    return false
  end
end