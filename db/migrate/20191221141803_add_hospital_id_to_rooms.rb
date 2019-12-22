class AddHospitalIdToRooms < ActiveRecord::Migration[5.1]
  def change
    add_column :rooms, :hospital_id, :integer
  end
end
