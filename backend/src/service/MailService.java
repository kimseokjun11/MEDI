package service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Date;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;
    
    // 보내는 사람 주소: application.properties 의 spring.mail.username (깃에 올리지 않음)
    @Value("${spring.mail.username:}")
    private String fromAddress;

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
        mail.setFrom(fromAddress);
        mailSender.send(mail);
    }
}
