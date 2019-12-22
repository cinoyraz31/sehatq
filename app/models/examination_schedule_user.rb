class ExaminationScheduleUser < ApplicationRecord
	belongs_to :examination_schedule
	belongs_to :user
	belongs_to :hospital

	# validates
	validates :examination_schedule_id, presence: { message: 'Mohon pilih jadwal dokter' }
	validates :user_id, presence: { message: 'Mohon masukkan klien' }
	validates :doctor_id, presence: { message: 'Mohon pilih dokter' }
	validates :dayname, presence: { message: 'Mohon pilih hari' }
	validates :registration_date, presence: { message: 'Mohon masukkan tanggal registrasi' }
	validates :no_order, presence: { message: 'Mohon masukkan nomor order' }

	#filtering
	scope :date_at, -> (date_at) { 
		case date_at
		when 'current'
			where(registration_date: DateTime.now.strftime("%Y-%m-%d")) 
		end
	}

	def self.order(data)
		value = new(data)

		if value.valid?
			value.save
			result = {
				status: 'success',
				msg: 'Selamat Anda berhasil mendaftar, silakan anda kerumah sakit yang bersangkutan pada jam yang sudah ditentukan',
			}
		else
			result = {
				status: 'error',
				msg: 'Anda Gagal mendaftar, periksa kembali data yang dibutuhkan',
			}
		end
		return result
	end
end