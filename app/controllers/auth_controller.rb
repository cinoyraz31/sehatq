class AuthController < ApplicationController
	before_action :set_register
	before_action :set_login

	def facebook
		byebug
		@user = User.from_omniauth(request.env["omniauth.auth"])
		
		if @user.persisted?
			sign_in_and_redirect @user, :event => :authentication
			set_flash_message(:notice, :success, :kind => “Facebook”) if is_navigational_format?
		else
			session[“devise.facebook_data”] = request.env[“omniauth.auth”]
			redirect_to new_user_registration_url
		end
	end

	def login
		unless session[:user].present?
			# @user = User.new
			@url_form = authorized_path
		else
			redirect_to dashboard_path
		end
	end

	def authorized
		result = AuthService.new(self).authorized(login_data)
		redirect = result[:redirect]

		CommonService.new(self).set_process_params(result, {
	      'redirect': redirect,
	      'render': 'login',
	    }) 
	end

	def register
		@title_for_layout = "Register"
		@user = User.new
	end

	def register_create
		data = AuthService.new(self).encryptPassword(register_data, {
			sourceField: :password,
			destinationField: :encrypted_password,
		})
		result = User.doRegister(data)
		@user = result[:user]

		CommonService.new(self).set_process_params(result, {
			'redirect': login_path,
			'render': 'register',
		}) 
	end

	def logout
		session.delete(:user)

		if session[:school].present?
			session.delete(:school)			
		end
		
		result = {
			'status': 'success',
			'msg': 'Anda telah keluar dari sistem, kami akan memberikan informasi lebih agar anda datang kembali',
		}
		CommonService.new(self).set_process_params(result, {
	      'redirect': login_path,
	    }) 
	end

	private
	def register_data
	    params.require(:user).permit(
	    	:email,
	    	:full_name,
	    	:password,
	    	:gender,
	    	:date_birth,
	    	:place_birth,
	    )
	end
	def login_data
		params.require(:user).permit(
			:email,
			:password,
		)
	end
	def set_login
		@url_form = authorized_path
	end
	def set_register
		@url_form = register_create_path
	end
end