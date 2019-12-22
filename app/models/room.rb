class Room < ApplicationRecord
	belongs_to :hospital
	
	has_many :examination_schedules
	has_many :examination_schedule_users

	# validates
	validates :hospital_id, presence: { message: 'Mohon pilih rumah sakit' }
	validates :name, presence: { message: 'Mohon masukkan nama ruangan' }

	def self.doSave(data, id = false)
		if id.present?
			msg = 'ubah'
			room = find(id)
			room.assign_attributes(data)
		else
			msg = 'tambah'
			room = new(data)
		end

		if room.valid?
			room.save

			result = {
				status: 'success',
				msg: "Berhasil #{msg} ruangan",
			}
		else
			room = set_before_view(room)
			result = {
				status: 'error',
				msg: "Gagal #{msg} ruangan, periksa kembali data yang dibutuhkan",
				room: room,
			}
		end
		return result
	end
end