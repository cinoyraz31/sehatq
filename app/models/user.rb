class User < ApplicationRecord
	has_secure_password
	devise :omniauthable, :omniauth_providers => [:facebook]
	
	belongs_to :provider, optional: true

	has_many :hospital_users
	has_many :examination_schedules
	has_many :examination_schedule_users

	attr_accessor :password

	validates :full_name, presence: { message: 'Mohon masukkan nama lengkap' }
	validates :first_name, presence: { message: 'Mohon masukkan nama depan' }
	validates :email, presence: { message: 'Mohon masukkan email' }, uniqueness: {message: 'email telah tersedia'}, format: { with: URI::MailTo::EMAIL_REGEXP, message: "Format email tidak sesuai" }
	validates :status, presence: { message: 'Mohon masukkan status' }
	validates :position, presence: { message: 'Mohon masukkan position' }
	validates :date_birth, presence: { message: 'Mohon masukkan tanggal lahir' }
	validates :password_digest, presence: { message: 'Mohon masukkan password' }

	def self.doRegister(data)
		user = new(data)
		flag = user.valid?

		if flag
			user.save

			result = {
				status: 'success',
				msg: 'Berhasil registrasi, silakan login dengan akun anda',
			}
		else
			user = set_before_view(user)
			result = {
				status: 'error',
				msg: 'Gagal registrasi, periksa kembali data yang dibutuhkan',
				user: user,
			}
		end
		return result
	end

	def self.doSave(data, params = {})
		user_id = params[:userId].present? ? params[:userId] : false
		freeText = params[:freeText].present? ? params[:freeText] : "dokter"

		if user_id.present?
			msg = 'ubah'
			user = find(user_id)
			user.assign_attributes(data)
		else
			msg = 'tambah'
			user = new(data)
		end

		if user.valid?
			user.save

			result = {
				status: 'success',
				msg: "Berhasil #{msg} #{freeText}",
			}
		else
			user = set_before_view(user)
			result = {
				status: 'error',
				msg: "Gagal #{msg} #{freeText}, periksa kembali data yang dibutuhkan",
				user: user,
			}
		end
		return result
	end


	def password_digest
		self.encrypted_password = encrypted_password
	    # @password_digest ||= Password.new(encrypted_password)
	end

  	# def password=(new_password)
	# 	@password_digest = Password.create(new_password)
    # 	self.encrypted_password = @password_digest
  	# end
end