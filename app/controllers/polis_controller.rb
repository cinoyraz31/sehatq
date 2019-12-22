class PolisController < ApplicationController
    before_action :active_menu
    before_action :breadscrumb, :except => [:index]
    before_action :set_add, only: [:new, :create]
    before_action :set_edit, only: [:edit, :update]
    before_action :get_data, only: [:new, :create, :edit, :update]
    before_action :get_poly, only: [:edit, :update, :delete]

    def index
        @title_for_layout = "Poli"
        @polies = Poly.get_paginate(params)
    end

    def new
        @polies = []
    end

    def create
        data = HospitalService.new(self).before_save_polis(params)
        result = Poly.bulkSave(data)
        @polies = result[:polies]

        CommonService.new(self).set_process_params(result, {
            'redirect': polis_path,
            'render': 'new',
        }) 
    end

    def edit
        render :edit
    end

    def update
        result = Poly.doSave(request_data, params[:id])
        @poly = result[:poly]

        CommonService.new(self).set_process_params(result, {
            'redirect': polis_path,
            'render': 'edit',
        }) 
    end

    def delete
        poly = Poly.find_by(id: params[:id])
        if poly.present?
            poly.destroy

            result = {
                'status': 'success',
                'msg': 'Berhasil hapus poly',
            }

            CommonService.new(self).set_process_params(result, {
                'redirect': polis_path,
            }) 
        else
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end

    private
    def active_menu
        @active_menu = 'hospital'
        @active_sub_menu = 'poli'
    end
    def set_add
        @title_for_layout = "Tambah"
        @url_form = create_polis_path
    end
    def set_edit
        @title_for_layout = "Ubah"
        @url_form = update_polis_path
    end
    def get_data
        @hospitals = Hospital.all.order(:name).pluck(:name, :id)
    end
    def get_poly
        @poly = Poly.find_by id: params[:id]
    end
    def breadscrumb
        @breadcrumb << {
            label: 'Poli',
            url: polis_path,
        }
    end
    def request_data
        params.require(:poly).permit(
            :hospital_id,
            :user_id,
            :title,
            :description,
        )
    end
end