class SchedulesController < ApplicationController
    before_action :active_menu
    before_action :breadscrumb, :except => [:index]
    before_action :set_add, only: [:new, :create]

    before_action :get_data, only: [:new, :create, :edit, :update]

    def index
        @title_for_layout = "Jadwal Dokter"
        @examination_schedules = ExaminationSchedule.get_paginate(params)
    end

    def new
        @examination_schedule = ExaminationSchedule.new.as_json
    end

    def create
        data = ExaminationService.new(self).before_save(request_data)
        result = ExaminationSchedule.doSave(data)
        @examination_schedule = result[:examination_schedule]
        
        CommonService.new(self).set_process_params(result, {
            'redirect': schedules_path,
            'render': 'new',
        }) 
    end

    def get_attribute
        @rooms = []

        if params[:hospital_id].present?
            @hospital_users = []
            @rooms = Room.where(hospital_id: params[:hospital_id]).order(:name)
            hospital_users = HospitalUser.where(hospital_id: params[:hospital_id])

            if hospital_users.present?
                hospital_users.each do |hospital_user|
                    @hospital_users << {
                        name: "#{hospital_user.user.full_name} | #{hospital_user.poly.title}",
                        id: hospital_user.id,
                    }
                end
            end
        end
    end

    private
    def active_menu
        @active_menu = "schedule"
    end
    def breadscrumb
        @breadcrumb << {
            label: 'Jadwal Dokter',
            url: schedules_path,
        }
    end
    def set_add
        @title_for_layout = "Tambah"
        @url_form = create_schedules_path
    end
    def get_data
        @hospitals = Hospital.all.order(:name).pluck(:name, :id)

        hospital_id = defined?(@examination_schedule['hospital_id']) == nil ? nil : @examination_schedule['hospital_id']
        hospital_id = defined?(request_data[:hospital_id]) == nil ? hospital_id : request_data[:hospital_id]
        
        @hospital_users = []
        @rooms = Room.where(hospital_id: hospital_id).order(:name).pluck(:name, :id)
        hospital_users = HospitalUser.where(hospital_id: hospital_id)

        if hospital_users.present?
            hospital_users.each do |hospital_user|
                @hospital_users << ["#{hospital_user.user.full_name} | #{hospital_user.poly.title}", hospital_user.id]
            end
        end
    end
    def request_data
        params.require(:examination_schedule).permit(
            :hospital_id,
            :room_id,
            :hospital_user_id,
            :dayname,
            :time_start,
            :time_end,
            :quota,
        )
    end
end