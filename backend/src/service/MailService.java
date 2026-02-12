package service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Date;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;
    
    private static final String FROM_ADDRESS = "***REMOVED***";

    // 1. 랜덤 임시 비밀번호 생성 (10자리)
    public String getTempPassword() {
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };
        StringBuilder str = new StringBuilder();
        SecureRandom sr = new SecureRandom();
        sr.setSeed(new Date().getTime());

        int idx = 0;
        for (int i = 0; i < 10; i++) {
            idx = sr.nextInt(charSet.length);
            str.append(charSet[idx]);
        }
        return str.toString();
    }

    // 2. 메일 전송
    public void sendMail(String toAddress, String title, String message) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(toAddress);
        mail.setSubject(title);
        mail.setText(message);
        mail.setFrom(FROM_ADDRESS);
        mailSender.send(mail);
    }
}
