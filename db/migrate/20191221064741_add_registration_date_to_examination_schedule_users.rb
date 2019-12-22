class AddRegistrationDateToExaminationScheduleUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :examination_schedule_users, :registration_date, :date
  end
end
