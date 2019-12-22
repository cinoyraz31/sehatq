class AdmissionsController < ApplicationController
    before_action :active_menu
    
    def index
        @title_for_layout = "Pendaftaran"
        params = params.present? ? params : {}
        params = params.merge({date_at: params[:date_at].present? ? params[:date_at] : 'current' })
        @admissions = ExaminationScheduleUser.get_paginate(params)
        @admissions = CommonService.new.call_refine_filter(@admissions, params, [
			:date_at, 
		])
    end

    private
    def active_menu
        @active_menu = 'admission'
    end
end