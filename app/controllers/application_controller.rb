class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  before_action :authentication
  before_action :breadscrumbs!
  layout :choose_layout

  def authentication
  	auth_service = AuthService.new(self)
  	@current_user = auth_service.authentication

		if @current_user.present?
			position = @current_user['position']
			@menu = auth_service.switch_menu(position)
			
			if params[:controller] == 'dashboard' && params[:action] == 'authentication'
				auth_service.redirectHome(position)
			end
		end
  end

  	def breadscrumbs!
		@breadcrumb = []
		if session[:school].present?
			url = panel_dashboard_path
		else
			url = dashboard_path	
		end
		@breadcrumb << {
			label: 'Dashboard',
			url: url,
		}
	end

  private
	def choose_layout
		if request.xhr?
			'ajax'
		elsif !@current_user
			'login'
		else
			'application'
		end
	end
end