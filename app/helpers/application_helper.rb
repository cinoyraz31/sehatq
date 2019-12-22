module ApplicationHelper

	def app_display_img(url)
		# return HTTParty.get(url, :headers => {
		# 	'Referer': "https://dev.api.highscope.gredu.co/''",
		# 	'Content-Type' => 'image/png',
		# })
	end

	def getDayName(value = false)
		result = ""
		case value
		when 'monday'
			return "Senin"
		when 'tuesday'
			return "Selasa"
		when 'wednesday'
			return "Rabu"
		when 'thursday'
			return "Kamis"
		when 'friday'
			return "Jumat"
		when 'saturday'
			return "Sabtu"
		when 'sunday'
			return "Minggu"
		end
	end

	def set_thead(headers = [])
		html_view = []
		if headers.present?
			headers.each do |header|
				label = header[:label] 
				content = header[:content] 

				if content.present?
					label = popover({
						label: label,
						title: label,
						content: content,
						html: true,
						placement: 'bottom'
					})
				end

				html_view << content_tag(:th, label).html_safe
			end
		end
		return html_view.join('')
	end

	def get_value_import(value)
		result = 'N/A'
		case value
			when 'user'
				return 'user'
			when 'calendar'
				return 'kalendar akademik'
			when 'book'
				return 'buku'
			when 'eedc'
				return 'EEDC'
			when 'thematic'
				return 'tematik'
		end
		return result
	end

	def popover(params = {})
		title = params[:title] || ''
		content = params[:content] || ''
		trigger = params[:trigger] || nil
		html = params[:html] || false
		placement = params[:placement] || false
		style = params[:style] || false
		label = params[:label] || icon_prm('prm-question-circle large-text')

		params = {
			'data-toggle': 'popover',
			title: title,
			'data-content': content,
		}

		if html.present?
			params['data-html'] = html
		end

		if placement.present?
			params['data-placement'] = placement
		end

		if trigger.present?
			params['data-trigger'] = trigger
		end

		if style.present?
			params['style'] = style
		end

		return link_to(label, 'javascript:void(0);', params)
	end

	def setAddress(address, separator = ',')
		street = address.street
		region = address.region.present? ? address.region.name : nil
		city = address.city.present? ? address.city.name : nil
		subarea = address.subarea.present? ? address.subarea.name : nil
		postal_code = address.postal_code

		if subarea.present?
			street += "#{separator} #{subarea}"
		end

		if city.present?
			street += "#{separator} #{city}"
		end

		if region.present?
			street += "#{separator} #{city} #{postal_code}"
		end

		return street
	end

	def combineToDate(start_date = false, end_date = false)
		result = 'N/A'
		if start_date.present? && end_date.present?
			result = start_date.strftime('%d-%m-%Y') +' - '+ end_date.strftime('%d-%m-%Y')
		end

		return result
	end

	def app_menu_generator(menu_arr, active_menu = false, active_sub_menu = false)
		menu_html = ''
		menu_child_html = ''

		menu_arr.each do |menu|
			its_open = ''
			a_class = ''
			actived = menu[:actived]
			label = menu[:label]
			url = menu[:url]
			label_active = menu[:label_active]
			prm_icon = menu[:prm_icon]
			icon = menu[:icon]
			has_submenu = menu[:childs].present? ? 'has-submenu' : nil

			if actived == active_menu
				a_class = 'active'
			end

			see_label = app_see_more(label, 13)
			txt_label = see_label

			if prm_icon || icon
				if prm_icon.present?
					txt_label = content_tag(:i, nil, class: prm_icon)+' '+see_label
				elsif icon.present?
					txt_label = fa_icon(menu[:icon])+' '+see_label
				end
			end

			if label_active.present?
				if label_active == 'active'
					txt_label += content_tag(:span, 'Aktif', class: 'menu-periode-active')
				end
			end

			if menu[:childs].present?	
				url = "##{actived}"
				temp = content_tag(:li, content_tag(:h6, label, class: 'expanded-title'))			
				menu[:childs].each do |menu_child|
					sub_class = ''
					sub_actived = menu_child[:actived]
					sub_label = menu_child[:label]
					label_active = menu_child[:label_active]
					sub_url = menu_child[:url]

					if sub_actived == active_sub_menu
						sub_class = 'active'
						its_open = 'its-opened'
					end

					if label_active.present?
						if label_active == 'active'
							sub_label += ' '+ content_tag(:span, 'Aktif', class: 'menu-periode-active')
						end
					end

					temp += content_tag(:li, link_to(sub_label.html_safe, sub_url, class: sub_class))
				end

				menu_child_html += content_tag(:ul, temp, {
					id: "#{actived}",
					class: its_open,

				})
			end

			menu_html += content_tag(:li, link_to(txt_label, url, {class: a_class}), { class: has_submenu })
		end
		return {
			menu: menu_html.html_safe,
			sub_menu: menu_child_html.html_safe,
		}
	end

	def gretting_date
		t = Time.now
		hour = t.strftime('%H')

		if (hour > '00' && hour < '10')
			result = 'Pagi'
		elsif (hour >= '10' && hour < '15')
			result = 'Siang'
		elsif (hour >= '15' && hour < '18')
			result = 'Sore'
		elsif (hour >= '18' && hour < '24')
			result = 'Malam'
		else
			result = ''
		end
	end

	def icon_prm(slug = false, content = 'span')
		content_tag(content, nil, class: slug)
	end

	def convert_nil(value, empty = 'N/A')
		if value.nil?
			empty
		else
			value
		end
	end

	def get_gender(value, empty = '-')
		if ['L', 'l', 'M', 'm', 'male'].include?(value)
			result = 'Laki Laki'
		elsif ['P', 'p', 'F', 'f', 'female'].include?(value)
			result  = 'Perempuan'
		elsif 
			result = empty
		end
		return result
	end

	def application__call_dropdown_action( values = [], label = icon_prm('prm-ellipsis-horizontal'))
		result = ''
		if values.count > 0
			return content_tag(:div, class: 'drop-table-menu') do
				concat(content_tag(:button, class: 'drop-toggle cgray2', id: 'drop', 'data-toggle': 'dropdown', 'aria-hashpopup': 'true', 'aria-expanded': 'false') do
					concat label
				end)
				concat(content_tag(:div, class: 'drop-table-content', 'aria-labelledby': 'drop') do
					concat(content_tag(:ul) do
						values.each do |value|
							text = value[:text]
							icon = value[:icon]
							fa_icon = value[:fa_icon]
							url = value[:url]
							attribute_link = value[:attribute_link]
							attribute_li = value[:attribute_li]
							authorized = (value[:authorized].nil? || value[:authorized] == true) ? true : false
							link_text = ''
							method = value[:method]
							confirm = value[:confirm]

							if icon.present?
								link_text = icon_prm(icon)
							elsif fa_icon.present?
								link_text = fa_icon(fa_icon)
							end
							link_text += " #{text}"

							if authorized
								concat(content_tag(:li, link_to(link_text, url, attribute_link), attribute_li))
							end
						end
					end)
				end)
			end 
		end
	end

	def to_url_params(values)
	    elements = []

	   if values.present?
			values.each do |value|
		    	named = value[0]
		    	val = value[1]

		    	if val.present?
		    		elements << "#{named}=#{val}"
		    	end
		    end
		    elements.join('&')
		end
	end

	def self.from_url_params(url_params)
	    result = {}.with_indifferent_access
	    url_params.split('&').each do |element|
	      	element = element.split('=')
	      	result[element[0]] = element[1]
	    end
	    result
	end

	def app_get_param_filter(options = {})
		default_options = {
			'data-form': '.form-target',
			'data-url-form': 'true',
			'data-pushstate': true,
			'data-abort': 'true',
			'data-wrapper-write-page': '.form-table-search table tbody, .filter-footer, .will_paginate',
			'data-loadingbar': 'true',
			'data-warpper-loader': 'true',
			'data-method': 'post'
		}

		if options.present? && options.count > 0
			default_options = default_options.merge(options)
		end
		
		return default_options
	end

	def app_empty_field(value, model_name = nil, field_name = nil, empty = nil)
		result = empty
		if value.present?
			if value.kind_of?(Array) || value.kind_of?(Hash)
				if value[model_name].present?
					if value[model_name].kind_of?(Array) || value[model_name].kind_of?(Hash)
						if value[model_name][field_name].present?
							result = value[model_name][field_name]
						else
							if field_name.nil?
								result = value[model_name]
							end
						end
					else
						result = value[model_name]
					end
				else
					if model_name.nil? && field_name.nil?
						result = value
					end
				end
			else
				result = value
			end
		end
		return result
	end

	def app_get_class(from = 1, untill = 12) 
		result = []

		for i in from..untill do
   	 		result << [i, i]
		end	
		return result
	end

	def app_see_more(value, param = 100)
		temp = value
		count_length = temp.length

		if count_length > param
			temp = temp[0..param]
			temp << '...'
		end
		return content_tag(:span, temp, {
			'data-toggle': 'tooltip',
			'data-placement': 'bottom',
			'title': value,
		}).html_safe
 	end

 	def get_image_default(attributes, type)
 		case type
		when 'user'
			img = 'default-user.png'
		when 'school'
			img = 'default-school.png'
		end
	  	return image_tag(img, attributes) 
 	end

 	def app_image_tag(img, attributes = {}, type = 'user')
 		if (img != " " and img != nil)
 			check = FileTest.exist?(img)

 			if FileTest.exist?(img)
		  		image_check = image_tag("#{img}",attributes)
		  	else
		  		image_check = get_image_default(attributes, type)
 			end
		else
			image_check = get_image_default(attributes, type)
		end
 	end
end
