class AddPolyIdToHospitalUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :hospital_users, :poly_id, :integer
  end
end
