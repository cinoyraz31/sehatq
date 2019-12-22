class AddHospitalUserIdToExaminationSchedules < ActiveRecord::Migration[5.1]
  def change
    add_column :examination_schedules, :hospital_user_id, :integer
  end
end
