class Hospital < ApplicationRecord
	has_many :hospital_users
	has_many :examination_schedules
	has_many :examination_schedule_users
	has_many :polies

	# validates
	validates :name, presence: { message: 'Mohon masukkan nama rumah sakit' }
	validates :phone, presence: { message: 'Mohon masukkan no telepon' }
	validates :address, presence: { message: 'Mohon masukkan alamat' }

	def self.doSave(data, id = false)
		if id.present?
			msg = 'ubah'
			hospital = find(id)
			hospital.assign_attributes(data)
		else
			msg = 'tambah'
			hospital = new(data)
		end

		if hospital.valid?
			hospital.save

			result = {
				status: 'success',
				msg: "Berhasil #{msg} rumah sakit",
			}
		else
			hospital = set_before_view(hospital)
			result = {
				status: 'error',
				msg: "Gagal #{msg} rumah sakit, periksa kembali data yang dibutuhkan",
				hospital: hospital,
			}
		end
		return result
	end
end