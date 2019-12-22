class HospitalsController < ApplicationController
    before_action :active_menu
    before_action :breadscrumb, :except => [:index]
    before_action :set_add, only: [:new, :create]
    before_action :set_edit, only: [:edit, :update]
    before_action :get_data, only: [:edit, :update, :delete]

    def index
        @title_for_layout = "Rumah Sakit"
        @hospitals = Hospital.get_paginate(params)
    end

    def new
        @hospital = Hospital.new.as_json
    end

    def create
        result = Hospital.doSave(request_data)
        @hospital = result[:hospital]
        CommonService.new(self).set_process_params(result, {
            'redirect': hospitals_path,
            'render': 'new',
        }) 
    end

    def edit
        render :new
    end

    def update
        result = Hospital.doSave(request_data, params[:id])
        @hospital = result[:hospital]
        CommonService.new(self).set_process_params(result, {
            'redirect': hospitals_path,
            'render': 'new',
        }) 
    end

    def delete
        hospital = Hospital.find_by(id: params[:id])
        if hospital.present?
            hospital.destroy

            result = {
                'status': 'success',
                'msg': 'Berhasil hapus rumah sakit',
            }

            CommonService.new(self).set_process_params(result, {
                'redirect': hospitals_path,
            }) 
        else
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end

    private
    def active_menu
        @active_menu = 'hospital'
        @active_sub_menu = 'build'
    end
    def breadscrumb
        @breadcrumb << {
            label: 'Rumah Sakit',
            url: hospitals_path,
        }
    end
    def set_add
        @title_for_layout = 'Tambah'
        @url_form = create_hospitals_path
    end
    def set_edit
        @title_for_layout = 'ubah'
        @url_form = update_hospitals_path
    end
    def get_data
        @hospital = Hospital.find_by id: params[:id].as_json

        unless @hospital.present?
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end
    def request_data
        params.require(:hospital).permit(
            :name,
            :phone,
            :address,
        )
    end
end