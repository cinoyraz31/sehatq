class RoomsController < ApplicationController
    before_action :active_menu
    before_action :breadscrumb, :except => [:index]
    before_action :set_add, only: [:new, :create]
    before_action :set_edit, only: [:edit, :update]
    before_action :get_room, only: [:edit, :update, :delete]
    before_action :get_data, only: [:new, :create, :edit, :update]

    def index
        @title_for_layout = 'Ruangan'
        @rooms = Room.get_paginate(params)
    end

    def new
        @room = Room.new.as_json
    end

    def create
        result = Room.doSave(request_data)
        @room = result[:room]

        CommonService.new(self).set_process_params(result, {
            'redirect': rooms_path,
            'render': 'new',
        }) 
    end

    def edit
        render :new
    end

    def update
        result = Room.doSave(request_data, params[:id])
        @room = result[:room]

        CommonService.new(self).set_process_params(result, {
            'redirect': rooms_path,
            'render': 'new',
        }) 
    end

    def update
        result = Room.doSave(request_data, params[:id])
        @room = result[:room]

        CommonService.new(self).set_process_params(result, {
            'redirect': rooms_path,
            'render': 'new',
        }) 
    end

    def delete
        room = Room.find_by(id: params[:id])
        if room.present?
            room.destroy

            result = {
                'status': 'success',
                'msg': 'Berhasil hapus ruangan',
            }

            CommonService.new(self).set_process_params(result, {
                'redirect': rooms_path,
            }) 
        else
            redirect_to request.referer, alert: 'Data tidak ditemukan'
        end
    end

    private
    def active_menu
        @active_menu = 'hospital'
        @active_sub_menu = 'room'
    end
    def breadscrumb
        @breadcrumb << {
            label: 'Ruangan',
            url: rooms_path,
        }
    end
    def set_add
        @title_for_layout = "Tambah"
        @url_form = create_rooms_path
    end
    def set_edit
        @title_for_layout = "Ubah"
        @url_form = update_rooms_path
    end
    def get_data
        @hospitals = Hospital.all.order(:name).pluck(:name, :id)
    end
    def get_room
        @room = Room.find_by id: params[:id]
    end
    def request_data
        params.require(:room).permit(
            :hospital_id,
            :name,
        )
    end
end