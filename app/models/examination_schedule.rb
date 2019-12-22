class ExaminationSchedule < ApplicationRecord
	belongs_to :user
	belongs_to :room
	belongs_to :hospital
	belongs_to :hospital_user

	has_many :examination_schedule_users

	# validates
	validates :hospital_id, presence: { message: 'Mohon pilih rumah sakit' }
	validates :room_id, presence: { message: 'Mohon pilih ruangan' }
	validates :hospital_user_id, presence: { message: 'Mohon pilih dokter dan polinya' }
	validates :dayname, presence: { message: 'Mohon pilih hari' }
	validates :time_start, presence: { message: 'Mohon masukkan waktu mulai' }
	validates :time_end, presence: { message: 'Mohon masukkan waktu berakhir' }
	validates :quota, presence: { message: 'Mohon masukkan kuota' }

	# filter
	scope :dayname, -> (dayname) { where(dayname: dayname) }

	def self.doSave(data, id = false)
		if id.present?
			msg = 'ubah'
			examination_schedule = find(id)
			examination_schedule.assign_attributes(data)
		else
			msg = 'tambah'
			examination_schedule = new(data)
		end

		if examination_schedule.valid?
			examination_schedule.save

			result = {
				status: 'success',
				msg: "Berhasil #{msg} jadwal dokter",
			}
		else
			examination_schedule = set_before_view(examination_schedule)
			result = {
				status: 'error',
				msg: "Gagal #{msg} jadwal dokter, periksa kembali data yang dibutuhkan",
				examination_schedule: examination_schedule,
			}
		end
		return result
	end
end