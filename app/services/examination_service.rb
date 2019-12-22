class ExaminationService
    def initialize(controller = false)
        @controller = controller
    end

    def setOrderRegistration(params, current_user)
        examination_schedule = ExaminationSchedule.find_by(id: params[:id])
        exam_count = examination_schedule.examination_schedule_users.where(registration_date: DateTime.now.strftime('%Y-%m-%d')).count

        data = {
            examination_schedule_id: examination_schedule.id,
            user_id: current_user['id'],
            doctor_id: examination_schedule.user_id,
            hospital_id: examination_schedule.hospital_id,
            dayname: examination_schedule.dayname,
            registration_date: DateTime.now.strftime('%Y-%m-%d'),
            no_order: exam_count + 1,
        }
    end

    def before_save(data)
        hospital_user = HospitalUser.find_by(id: data[:hospital_user_id])

        if hospital_user.present?
            data[:user_id] = hospital_user.user_id
        end

        if data[:time_start].present?
            time_start = data[:time_start].to_time - 30*60

            if time_start.present?
                data[:close_register] = time_start.strftime("%H:%M")
            end
        end
        return data
    end
end