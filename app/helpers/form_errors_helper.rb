module FormErrorsHelper
   def error_message_on(object, method)
     return unless object.respond_to?(:errors) && object.errors.include?(method)
     errors = field_errors(object, method).join(', ')

     content_tag(:div, errors, class: 'form-group-error')
   end

   def error_message_field(object = {}, idx)
    msg = false
    object = object.present? ? object : {}
    if object[idx].present?
      msg = object[idx].first
    end

    if msg.present?
      content_tag(:div, msg, class: 'form-group-error')
    end
   end

   def error_message_on_json(errors, field_name)
   	if errors.present?
      msg = nil
      errors.each do |key, message|
        if key.as_json == field_name.as_json
          msg = message
          break
        end
      end
   		# error = errors.select {|error| error[:field_name] == field_name.as_json }

	   	if msg.present?

        if msg.kind_of?(Array)
          msg = msg.join(', ')
        end

	   		# msg = error.first['desc'] || nil
	   		content_tag(:div, msg, class: 'form-group-error')
	   	end
   	end
   end

   private
   def field_errors(object, method)
     object.errors[method]
   end
end