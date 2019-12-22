class CommonService
	def initialize(controller = false)
		@controller = controller
	end

	def _callPeriodeDate(period = false, options = {})
		periode_date_to = options[:date_to].present? ? options[:date_to] : DateTime.now.strftime("%Y-%m-%d")
		timestamp = Date.parse(periode_date_to)

		case period
		when 'monthly'
			timestamp_prev = (timestamp - 1.months + 1.days)
			periode_date_from = timestamp_prev.strftime("%Y-%m-%d")
		
		when 'quarterly'
			timestamp_prev = (timestamp - 3.months + 1.days)
			periode_date_from = timestamp_prev.strftime("%Y-%m-%d")

		when 'mid-monthly'
			timestamp_prev = (timestamp - 6.months + 1.days)
			periode_date_from = timestamp_prev.strftime("%Y-%m-%d")

		when 'yearly'
			timestamp_prev = (timestamp - 12.months + 1.days)
			periode_date_from = timestamp_prev.strftime("%Y-%m-%d")

		else
			timestamp_prev = (timestamp - 6.days)
			periode_date_from = timestamp_prev.strftime("%Y-%m-%d")
		end

		return {
			periode_date_from: periode_date_from,
			periode_date_to: periode_date_to,
			title: "#{timestamp_prev.strftime('%d/%m/%Y')} - #{timestamp.strftime('%d/%m/%Y')}"
		}
	end

	def get_header(slug = false)
		result = []

		case slug
		when 'user'
			result = [
				{
					label: 'full_name',
					content: 'Diisi dengan nama lengkap pengguna siswa, orang tua atau (staff/guru), contoh: Ahmad Bukhori, mohon jangan ada ,'
				},
				{
					label: 'email',
					content: 'Diisi dengan email pengguna siswa, orang tua atau (staff/guru), email tidak boleh sama dengan akun lain maupun sekolah lain, contoh: ahmad@gredu.asia'
				},
				{
					label: 'password',
					content: 'diisi dengan password pengguna siswa, orang tua atau (staff/guru), minimal karakter password 6'
				},
				{
					label: 'username',
					content: 'diisi dengan username pengguna siswa, orang tua atau (staff/guru), username tidak boleh sama dengan akun lain maupun sekolah lain'
				},	
				{
					label: 'phone_number',
					content: 'diisi dengan nomor telepon pengguna, dan harus berbeda dengan user lain'
				},
				{
					label: 'dob',
					content: 'diisi dengan tanggal lahir pengguna, dengan contoh format (YYYY-MM-DD) 2003-01-01'
				},
				{
					label: 'gender',
					content: 'diisi dengan jenis kelamin pengguna cukup dengan format M untuk laku-laku, dan F untuk perempuan'
				},
				{
					label: 'address',
					content: 'diisi dengan alamat pengguna, mohon jangan ada , di alamat ini'
				},
				{
					label: 'roles',
					content: 'diisi dengan jabatan pengguna di sistem ini, terkait beberapa jabatan "student, parent, staff, teacher, admin, headmaster dan librarian", dan anda bisa memiliki lebih dari satu jabatan dengan pemisah | contoh: teacher|parent'
				},
				{
					label: 'class_name',
					content: 'diisi dengan nama kelas di sekolah tersebut (field ini khusus untuk siswa/student dan wali kelas apabila selain jabatan ini abaikan) dengan contoh: XI IPA 2'
				},
				{
					label: 'nisn',
					content: 'diisi dengan NISN yang terdaftar pada pemerintah',
				},
				{
					label: 'nis',
					content: 'diisi dengan NIS yang terdaftar pada sekolah',
				},
				{
					label: 'unique_id',
					content: 'kebutuhan user pada saat mendaftar aplikasi gredu',
				},
				{
					label: 'related_student',
					content: 'diisi khusus jabatan orang tua/parent, dan diisi unique_id siswa yang merupakan anaknya. Untuk orang tua yang memiliki lebih dari 1 anak cukup dengan | contoh: cmbbs01|cmbbs02'
				},
				{
					label: 'nip',
					content: 'diisi dengan NIP (khusus jabatan staff guru dan sederajatnya) harus beda tidak boleh sama'
				}
			]
		when 'thematic'
			result = [
				{
					label: 'curriculum_code',
					content: 'Kode kurikulum yang ada di list kurikulum huruf besar atau kecil tidak masalah yang penting sesuai dengan simbol huruf yang ada di list kurikulum',
				},
				{
					label: 'grade',
					content: 'Ada di menu tingkatan pastikan yang dipilih sesuai dengan kuriulum yang anda set sebelumnya harus numerik, anda bisa ambil dari list tingkatan dengan field tahun kelas',
				},
				{
					label: 'theme_number',
					content: 'Nomor tema (harus numerik), apabila memiliki sub tema lebih dari 1, maka tidak boleh kosong. samakan dengan row sebelumnya. dan apabila ingin membuat tema baru maka nomor harus dibedakan ',
				},
				{
					label: 'theme_name',
					content: 'Title/nama tema, apabila memilik sub tema lebih dari 1 row selanjutnya bisa di abaikan.',
				},
				{
					label: 'subtheme_number',
					content: 'Nomor sub tema (harus numerik), dan tidak boleh sama dalam 1 tema',
				},
				{
					label: 'subtheme_name',
					content: 'Title/name sub tema',
				},
				{
					label: 'subject_codes',
					content: 'Kodes mata pelajaran, yang anda pilih harus berada di kurikulum dan grade yang anda sudah set sebelumnya, jika tidak sesuai maka mata pelajaran tidak akan masuk ke tema ataupun ke subtema, untuk memasukkan mata pelajaran lebih dari 1, cukup di berikan (|) tanpa ada spasi contoh: pjokSDP|PknSDP|BIndoSDP',
				},
			]
		end	
		return result	
	end

	def getBreadcrumbExcel(values, params = {})
		result = []
		label = params[:label].present? ? params[:label] : 'Export Excel'
		url = params[:url].present? ? params[:url] : false
		request = params[:request].present? ? params[:request] : {}
		limit = params[:limit].present? ? params[:limit] : 1000

		query = ''
		if request.query_parameters.present?
			query = '?' + request.query_parameters.to_query
		end

		if values.count > 0 && values.count <= limit
			result = [
				{
					label: 'Export Excel',
					url: url + query,
				},
			]
		end

		return result
	end

	def removeSession(data_arr = [])
		if data_arr.present? && data_arr.count > 0
			data_arr.each do |session_name|
				@controller.session.delete(session_name)
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

	def get_call_http(action, params = {})
		environment = ENV['RAILS_ENV'] || nil
		method = params[:method] || 'get'
		result = []
		response = []
		status = 200

		# token = @controller.current_user[:user_token]
		headers = {
			# 'Authorization' => "Bearer #{token}",
			'Content-Type' => 'application/json',
		}

		url_base = Figaro.env.order_service_url || "https://dev.api.pms.salinsimpan.com"
		url = "#{url_base}/#{action}"
		case method
		when 'post'
			data = params[:data]
			file = params[:file]

			request = {
				:body => data.to_json,
			    :headers => headers
			}

			if file.present?
				request[:keystore] = File.read(file.path)
			end

			response = HTTParty.post(url.to_s, request)
		when 'get'
			response = HTTParty.get(url.to_s, timeout: 5 )	
		when 'put'
			data = params[:data]
			file = params[:file]

			request = {
				:body => data.to_json,
			    :headers => headers
			}

			if file.present?
				request[:keystore] = File.read(file.path)
			end

			response = HTTParty.put(url.to_s, request)
		when 'delete'
			response = HTTParty.delete(url.to_s, :headers => headers)	
		end
			
		# case status
		# when 408
		# 	@controller.redirect_to @controller.request_time_out_path
		# when 500
		# 	@controller.redirect_to @controller.error_server_path
		# end

		return response
	end

	def file_extension(filename)
	  File.extname(filename).delete('.')
	end

	def date_range_converter(data, field_name, options = {})
		date_start = options['date_start'].present? ? options['date_start'] : 'date_start'
		date_end = options['date_end'].present? ? options['date_end'] : 'date_end'
		separator = options[:separator].present? ? options[:separator] : ' - '
		reserve = options[:reserve].present? ? options[:reserve] : false
		no_delete = options[:no_delete].present? ? options[:no_delete] : false

		if reserve.present?
			date_arr = []
			date_start = data[date_start].present? ? data[date_start] : nil
			date_arr << date_start.strftime('%Y-%m-%d')

			date_end = data[date_end].present? ? data[date_end] : nil
			date_arr << date_end.strftime('%Y-%m-%d')

			data[field_name] = date_arr.join(' - ')
		else
			value = data[field_name]
			if value.present?
				date_arr = value.split(separator)
				data[date_start] = date_arr[0]
				data[date_end] = date_arr[1]

				unless no_delete.present?
					data.delete(field_name)
				end
			end
		end
		return data
	end

	def setSchool(data)
		school = @controller.session[:school]

		if school.present?
			data[:school_id] = school['id']
		end
		return data
	end

	def call_refine_filter(values, params, variables = [])
		filters = []
		if values.present?
			if variables.present? && variables.count > 0
				variables.each do |variable|
					key = params.present? ? params[variable] : false

					if key.present?
						values = values.public_send(variable, key) if key.present?
					end
				end
			end
		end
		return values
	end

	def set_process_params(result = [], options = [])
		status = result.present? ? result[:status] : false
		view = options.present? ? options[:render] : false
		notification = result.present? ? result[:notification] : false
		link = options.present? ? options[:redirect] : false
		session = options.present? ? options[:session] : false

		# set flash 
		set_flash(result)
		#notification
		set_notification(notification)

		if status == 'error'
			if view.present?
				@controller.render view
			else
				@controller.redirect_to link
			end
		end

		if link.present? && status == 'success'

			if session.present?
				data = session[:data].present? ? session[:data] : nil
				name = session[:name].present? ? session[:name] : nil

				@controller.session[name] = data
  			end

			link = (link == 'referer') ? @controller.request.referer : link
			@controller.redirect_to link
		end
	end

	def set_notification(notif = false)
		if notif.present?
			notif[:user_id] = @controller.session[:user]['id']

			#save
			notification = Notification.new(notif)
			flag = notification.valid?

			if flag
				notification.save
			end
		end
	end

	def set_flash(result = false)
		status = result.present? ? result[:status] : false 
		msg = result.present? ? result[:msg] : false

		case status
		when 'success'
			@controller.flash[:notice] = msg
		when 'error'
			@controller.flash[:alert] = msg
		end
	end

	def before_save_media(data, field_name, related_model = false)
		data_save = set_asset(data, field_name, related_model)
		
		asset = Asset.new(data_save)

		return {
			flag: asset.valid?,
			asset: asset,			
		}
	end

	def set_asset(data, field_name, related_model)
		photo = data[field_name]
		hidden_photo = data["hidden_#{field_name}"]

		if photo.present?
			return {
				doc_aws_url: AwsService.new(self).upload(photo),
				filename: photo.original_filename,
				content_type: File.extname(photo.path),
				file_size: File.size(photo.path),
				uploader_id: @controller.current_user_id,
				related_model: related_model,
				model_asset_attributes: {
					related_model: related_model,
				}
			}
		elsif hidden_photo.present?
			photo = URI.parse(hidden_photo)
			return {
				doc_aws_url: hidden_photo,
				filename: File.basename(photo.path),
				uploader_id: @controller.current_user_id,
				content_type: File.extname(photo.path),
				related_model: related_model,
				model_asset_attributes: {
					related_model: related_model,
				}
			}
		end
		return false
	end
end