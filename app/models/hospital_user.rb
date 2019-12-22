class HospitalUser < ApplicationRecord
	belongs_to :hospital
	belongs_to :poly
	belongs_to :user

	# validates
	validates :hospital_id, presence: { message: 'Mohon pilih rumah sakit' }
	validates :poly_id, presence: { message: 'Mohon pilih poli' }
	validates :user_id, presence: { message: 'Mohon pilih dokter' }

	def self.doSave(data, id = false)
		if id.present?
			msg = 'ubah'
			hospital_user = find(id)
			hospital_user.assign_attributes(data)
		else
			msg = 'tambah'
			hospital_user = new(data)
		end

		if hospital_user.valid?
			hospital_user.save

			result = {
				status: 'success',
				msg: "Berhasil #{msg} dokter untuk penugasan",
			}
		else
			hospital_user = set_before_view(hospital_user)
			result = {
				status: 'error',
				msg: "Gagal #{msg} dokter untuk penugasan, periksa kembali data yang dibutuhkan",
				hospital_user: hospital_user,
			}
		end
		return result
	end
end