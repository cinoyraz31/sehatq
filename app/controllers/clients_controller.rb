class ClientsController < ApplicationController
    before_action :active_menu

    def index
        @title_for_layout = "Pelanggan"
        @clients = User.get_paginate(params).where(position: 'user')
    end

    private
    def active_menu
        @active_menu = 'user'
        @active_sub_menu = 'client'
    end
end