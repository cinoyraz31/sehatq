class RegistrationsController < ApplicationController
    before_action :active_menu
    before_action :breadscrumb, :except => [:index]
    before_action :regist_now, only: [:add, :create]
    def index
        params = params.present? ? params : {}
        params = params.merge({dayname: params[:dayname].present? ? params[:dayname] : DateTime.new.strftime("%A").downcase })

        @title_for_layout = "Registrasi Pasien"
        @examination_schedules = ExaminationSchedule.get_paginate(params)
    end

    def add
        @examination_schedule_user = ExaminationScheduleUser.new.as_json
    end

    def create
        data = ExaminationService.new(self).setOrderRegistration(params, @current_user)
        result = ExaminationScheduleUser.order(data)

        CommonService.new(self).set_process_params(result, {
            'redirect': registrations_path,
        })
    end

    private
    def active_menu
        @active_menu = "registration"
    end
    def breadscrumb
        @breadcrumb << {
            label: 'Registrasi Pasien',
            url: registrations_path,
        }
    end
    def regist_now
        @title_for_layout = "Daftar Sekarang"
        @url_form = create_registrations_path
        
        @examination_schedule = examination_schedule = ExaminationSchedule.find_by(id: params[:id])
        @exam_count = exam_count = examination_schedule.examination_schedule_users.where(registration_date: DateTime.now.strftime('%Y-%m-%d')).count

        if exam_count >= examination_schedule.quota || Time.now.strftime('%H:%M') >= examination_schedule.close_register.strftime('%H:%M')
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end

    private
end