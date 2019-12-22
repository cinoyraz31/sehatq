class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.get_paginate(params, options = {})
  	page = params[:page]

  	per_page = options[:per_page] || 10

  	self.paginate(:page => params[:page], :per_page => per_page)
  end

  def self.set_before_view(values)
		result = {}
		if values.present?
			result = values.as_json

			if values.errors.present?
				result['errors'] = values.errors.as_json
			end
		end
		return result
  end
end