class Poly < ApplicationRecord
    belongs_to :hospital

    has_many :hospital_users

    # validates
    validates :hospital_id, presence: { message: 'Mohon pilih rumah sakit' }
    validates :title, presence: { message: 'Mohon masukkan poli' }
    validates :description, presence: { message: 'Mohon masukkan keterangan poli' }

    def self.doSave(data, id = false)
        if id.present?
			msg = 'ubah'
			poly = find(id)
			poly.assign_attributes(data)
		else
			msg = 'tambah'
			poly = new(data)
		end

		if poly.valid?
			poly.save

			result = {
				status: 'success',
				msg: "Berhasil #{msg} poli",
			}
		else
			poly = set_before_view(poly)
			result = {
				status: 'error',
				msg: "Gagal #{msg} poli, periksa kembali data yang dibutuhkan",
				poly: poly,
			}
		end
		return result
    end

    def self.bulkSave(dataArr)
        flags = dataArr[:flags]
        data_saves = dataArr[:data_saves]
        
        if data_saves.present? && !flags.include?(false)
            data_saves.each do |data_save|
                data_save.save
            end

            result = {
                status: 'success',
                msg: 'Berhasil tambah polis',
            }
        else
            polies = set_before_views(data_saves)
            result = {
                status: 'error',
                msg: 'Gagal tambah poli, mohon masukkan data yang dibutuhkan',
                polies: polies,
            }
        end
        return result
    end

    def self.set_before_views(dataArr)
        result = []
        if dataArr.present?
            dataArr.each do |data|
                result << set_before_view(data)
            end
        end
        return result
    end
end