class DoctorsController < ApplicationController
    before_action :active_menu
    before_action :set_add, only: [:new, :create]
    before_action :set_edit, only: [:edit, :update]
    before_action :get_data, only: [:edit, :update, :delete]

    def index
        @title_for_layout = "Dokter"
        @doctors = @clients = User.get_paginate(params).where(position: 'doctor')
    end

    def new
        @user = User.new.as_json
    end

    def create
        data = UserService.new(self).before_save_doctor(request_data)
        result = User.doSave(data)
        @user = result[:user]

        CommonService.new(self).set_process_params(result, {
            'redirect': doctors_path,
            'render': 'new',
        }) 
    end

    def edit
        render :new
    end

    def update
        data = UserService.new(self).before_save_doctor(request_data)
        result = User.doSave(data, {
            userId: params[:id],
        })
        @user = result[:user]

        CommonService.new(self).set_process_params(result, {
            'redirect': doctors_path,
            'render': 'new',
        }) 
    end

    def delete
        user = User.find_by(id: params[:id])
        if user.present?
            user.destroy

            result = {
                'status': 'success',
                'msg': 'Berhasil hapus dokter ini',
            }

            CommonService.new(self).set_process_params(result, {
                'redirect': doctors_path,
            }) 
        else
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end

    private
    def active_menu
        @active_menu = 'user'
        @active_sub_menu = 'doctor'
    end
    def set_add
        @title_for_layout = "Tambah"
        @url_form = create_doctors_path
    end
    def set_edit
        @slug = 'edit'
        @title_for_layout = "ubah"
        @url_form = update_doctors_path
    end
    def get_data
        @user = User.find_by id: params[:id].as_json

        unless @user.present?
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end
    def request_data
        params.require(:user).permit(
            :full_name,
            :email,
            :password,
            :gender,
            :date_birth,
            :place_birth,
        )
    end
end