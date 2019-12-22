class AssignDoctorsController < ApplicationController
    before_action :active_menu
    before_action :breadscrumb, :except => [:index]
    before_action :set_add, only: [:new, :create]
    before_action :set_edit, only: [:edit, :update]
    before_action :get_doctor, only: [:edit, :update, :delete]
    before_action :get_data, only: [:new, :create, :edit, :update]

    def index
        @title_for_layout = "Penugasan Dokter"
        @doctors = HospitalUser.joins(:user).get_paginate(params).where("users.position = ? and users.status = ?", 'doctor', 'active')
    end

    def new
        @hospital_user = HospitalUser.new.as_json
    end

    def create
        result = HospitalUser.doSave(request_data)
        @hospital_user = result[:hospital_user]

        CommonService.new(self).set_process_params(result, {
            'redirect': assign_doctors_path,
            'render': 'new',
        })
    end

    def edit
        render :new
    end

    def update
        result = HospitalUser.doSave(request_data, params[:id])
        @hospital_user = result[:hospital_user]

        CommonService.new(self).set_process_params(result, {
            'redirect': assign_doctors_path,
            'render': 'new',
        })
    end

    def delete
        hospital_user = HospitalUser.find_by(id: params[:id])
        if hospital_user.present?
            hospital_user.destroy

            result = {
                'status': 'success',
                'msg': 'Berhasil hapus dokter penugasan',
            }

            CommonService.new(self).set_process_params(result, {
                'redirect': assign_doctors_path,
            }) 
        else
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end

    def get_polies
        @polies = []

        if params[:hospital_id].present?
            @polies = Poly.where(hospital_id: params[:hospital_id]).order(:title)
        end
    end

    private
    def active_menu
        @active_menu = 'hospital'
        @active_sub_menu = 'assign-doctor'
    end
    def breadscrumb
        @breadcrumb << {
            label: 'Penugasan Dokter',
            url: assign_doctors_path,
        }
    end
    def set_add
        @title_for_layout = "Tambah"
        @url_form = create_assign_doctors_path
    end
    def set_edit
        @title_for_layout = "Ubah"
        @url_form = update_assign_doctors_path
    end
    def get_data
        @doctors = User.where(position: 'doctor', status: 'active').order(:full_name).pluck(:full_name, :id)
        @hospitals = Hospital.all.order(:name).pluck(:name, :id)

        hospital_id = defined?(@hospital_user['hospital_id']) == nil ? nil : @hospital_user['hospital_id']
        hospital_id = defined?(request_data[:hospital_id]) == nil ? hospital_id : request_data[:hospital_id]
        
        @polies = Poly.where(hospital_id: hospital_id).order(:title)
    end
    def get_doctor
        @hospital_user = HospitalUser.find_by(id: params[:id]).as_json

        unless @hospital_user.present?
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end
    def request_data
        params.require(:hospital_user).permit(
            :hospital_id,
            :poly_id,
            :user_id,
        )
    end
end