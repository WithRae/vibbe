<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your VIBBE Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
          style="background-color:#0d0d0d;border:1px solid rgba(0,255,136,0.2);border-radius:18px;overflow:hidden;">

          {{-- Top neon line --}}
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,transparent,#00ff88,transparent);"></td>
          </tr>

          {{-- Header --}}
          <tr>
            <td align="center" style="padding:36px 40px 20px;">
              <p style="margin:0;font-size:26px;font-weight:700;color:#00ff88;
                         letter-spacing:0.15em;text-shadow:0 0 10px rgba(0,255,136,0.5);">
                ◈ VIBBE
              </p>
              <p style="margin:10px 0 0;font-size:13px;color:#666;letter-spacing:0.05em;">
                FOCUS. FLOW. RISE.
              </p>
            </td>
          </tr>

          {{-- Body --}}
          <tr>
            <td style="padding:10px 40px 30px;">
              <p style="margin:0 0 8px;font-size:15px;color:#aaa;">
                Hey <strong style="color:#e8e8e8;">{{ $userName }}</strong>,
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#666;line-height:1.6;">
                Use the code below to verify your email address. It expires in <strong style="color:#e8e8e8;">5 minutes</strong>.
              </p>

              {{-- OTP Block --}}
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:#0a0a0a;border:1px solid rgba(0,255,136,0.35);
                                border-radius:12px;padding:24px 48px;
                                box-shadow:0 0 30px rgba(0,255,136,0.1);">
                      <p style="margin:0 0 6px;font-size:11px;color:#555;
                                 text-transform:uppercase;letter-spacing:0.15em;">
                        Verification Code
                      </p>
                      <p style="margin:0;font-size:42px;font-weight:700;
                                 color:#00ff88;letter-spacing:0.3em;
                                 text-shadow:0 0 20px rgba(0,255,136,0.6);">
                        {{ $otp }}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#555;line-height:1.6;">
                If you didn't create a VIBBE account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          {{-- Footer --}}
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid rgba(0,255,136,0.08);">
              <p style="margin:0;font-size:12px;color:#444;text-align:center;">
                © {{ date('Y') }} VIBBE — Built for ADHD & Functional Depression
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>