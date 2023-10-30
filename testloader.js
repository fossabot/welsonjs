// testloader.js

// load libraries
var FILE = require("lib/file");

// load the test profile
var profile = JSON.parse(FILE.readFile("data/test-oss-20231030.json", FILE.CdoCharset.CdoUTF_8));

// implement the tests
var test_implements = {
    
    // Ref 1: https://gist.github.com/CityRay/c56e4fa874af9370cc1a367bd43095b0
    "es5_polyfills": function() {
        var parseIntIgnoresLeadingZeros = (function () {
          return parseInt('010', 10) === 10;
        }());
        console.log("parseIntIgnoresLeadingZeros: " + String(parseIntIgnoresLeadingZeros) + " (Default on the built-in engine: true)");

        var DateISOString = (function () {
          return !!(Date && Date.prototype && Date.prototype.toISOString);
        }());
        console.log("DateISOString: " + String(DateISOString) + " (Default on the built-in engine: false)");

        var result = !!(parseIntIgnoresLeadingZeros && DateISOString);

        console.log(result ?
            "ECMAScript 5 수준의 런타임입니다. 필수 테스트를 모두 통과하였습니다." :
            "ECMAScript 5 수준의 런타임이 아닙니다. 필수 테스트 중 하나를 실패하였습니다.");
    },

    // Ref 1: https://learn.microsoft.com/en-us/previous-versions/windows/desktop/regprov/stdregprov
    "registry_find_provider": function() {
        var REG = require("lib/registry");

        console.log("레지스트리 제공자(StdRegProv) 클래스에 접근을 시도합니다.");
        var provider = REG.getProvider();
        
        console.log(typeof provider !== "undefined" ?
            "레지스트리 제공자 클래스에 성공적으로 연결되었습니다." :
            "레지스트리 제공자 클래스에 연결하는데 문제가 있습니다.");
    },

    "registry_write": function() {
        var REG = require("lib/registry");
        var appName = "welsonjs";
        
        console.log("레지스트리에 쓰기를 시도합니다.");
        REG.write(REG.HKCU, appName + "\\WelsonJSTest", "", "here are in", REG.STRING);
        console.log("레지스트리에 쓰기를 완료하였습니다.");
    },

    "registry_read": function() {
        var REG = require("lib/registry");
        var appName = "welsonjs";
        
        console.log("레지스트리 읽기를 시도합니다.");
        var response = REG.read(REG.HKCU, appName + "\\WelsonJSTest", "", REG.STRING);
        console.log("읽음: " + response);
        console.log(response === "here are in" ?
            "레지스트리를 정상적으로 읽었습니다." :
            "레지스트리를 읽는데 문제가 있습니다.");
    },

    "wmi_create_object": function() {
        var WMI = require("lib/wmi");
        console.log(typeof WMI.create().interface !== "undefined" ?
            "WMI 객체를 정상적으로 생성하였습니다." :
            "WMI 객체를 생성하는데 문제가 있습니다.");
    },

    "wmi_execute_query": function() {
        var WMI = require("lib/wmi");

        var queryString = "SELECT Caption FROM Win32_OperatingSystem";
        console.log("실행할 쿼리: " + queryString);

        var result = WMI.execQuery(queryString).fetch().get("Caption").trim();
        console.log("현재 윈도우즈 배포판 종류: " + result);
    },

    "wmi_result_query": function() {
        var WMI = require("lib/wmi");

        var queryString = "SELECT Caption FROM Win32_OperatingSystem";
        console.log("실행할 쿼리: " + queryString);

        var result = WMI.execQuery(queryString).fetch().get("Caption").trim();
        console.log("현재 윈도우즈 배포판 종류: " + result);
    },

    "shell_create_object": function() {
        var SHELL = require("lib/shell");
        console.log(typeof SHELL.create().interface !== "undefined" ?
            "윈도우즈 쉘(Shell) 객체를 정상적으로 생성하였습니다." :
            "윈도우즈 쉘(Shell) 객체를 생성하는데 문제가 있습니다.");
    },

    "shell_build_command_line": function() {
        var SHELL = require("lib/shell");
        console.log("쉘 명령의 무결성을 훼손시킬 수 있는 경우(따옴표, 쌍따옴표, 띄어쓰기 등을 포함한 경우)를 테스트합니다.");

        // 모든 경우를 하나의 배열에 포함
        var test_args = [
            "ppap.exe",
            "\"pen\"",
            "'apple'",
            "apple pen",
            "pineapple pen"
        ];
        
        // 입력과 출력 확인
        console.log("입력 인자: " + test_args.join(" / "));
        console.log("출력 문자열: " + SHELL.build(test_args));
        console.log("정상적으로 명령행이 만들어졌는지 확인하세요.");
    },

    "shell_set_charset": function() {
        var SHELL = require("lib/shell");

        var ShellInstance = SHELL.create();
        console.log("현재 기준 문자셋: " + ShellInstance.charset);
        console.log("기준 문자셋을 유니코드(UTF-8)로 변경합니다.");
        ShellInstance.setCharset(SHELL.CdoCharset.CdoUTF_8);
        console.log("현재 기준 문자셋: " + ShellInstance.charset);
    },

    "shell_working_directory": function() {
        var SHELL = require("lib/shell");

        var ShellInstance = SHELL.create();
        console.log("현재 작업 폴더: " + ShellInstance.workingDirectory);

        console.log("작업 폴더를 변경합니다.");
        ShellInstance.setWorkingDirectory(ShellInstance.workingDirectory + "\\data");
        console.log("현재 작업 폴더: " + ShellInstance.workingDirectory);
    },

    "shell_create_process": function() {
        var SHELL = require("lib/shell");
    },

    "shell_execute": function() {
        var SHELL = require("lib/shell");

        var response = SHELL.exec("echo done");
        console.log(response == "done" ?
            "쉘(Shell) 출력이 정상적으로 작동합니다." :
            "쉘(Shell) 출력에 문제가 있습니다.");
    },

    "shell_run": function() {
        var SHELL = require("lib/shell");

        SHELL.run("calc");
        console.log("잠시 후 계산기 프로그램이 열리는지 확인하여 주세요.");
    },

    "shell_run_as": function() {
        var SHELL = require("lib/shell");

        console.log("관리자 권한 요청을 확인하세요.");
        SHELL.runAs("calc");
        console.log("잠시 후 계산기 프로그램이 열리는지 확인하여 주세요.");
    },

    "shell_find_my_documents": function() {
        var SHELL = require("lib/shell");

        console.log("내 문서 폴더 위치: " + SHELL.getPathOfMyDocuments());
    },

    "shell_release": function() {
        var SHELL = require("lib/shell");

        var ShellInstance = SHELL.create();
        ShellInstance.release();

        console.log(ShellInstance.interface != null ?
            "정상적으로 해제되지 않았습니다." :
            "정상적으로 해제되었습니다.");
    },

    "powershell_set_command": function() {
        
    },

    "powershell_set_file": function() {
        
    },

    "powershell_set_uri": function() {
        
    },

    "powershell_execute": function() {
        
    },

    "powershell_run_as": function() {
        
    },
    
    "system_resolve_env": function() {
        var SYS = require("lib/system");

        console.log("기본 프로그램 설치 폴더: " + SYS.getEnvString("PROGRAMFILES"));
        console.log("기본 프로그램 설치 폴더가 정상적인 위치를 가르키고 있는지 확인하세요.");
    },

    "system_check_as": function() {
        var SYS = require("lib/system");

        console.log(SYS.isElevated() ?
            "이 런타임은 관리자 모드에서 실행되고 있지 않습니다." :
            "이 런타임은 관리자 모드에서 실행되고 있습니다.");
    },

    "system_get_os_version": function() {
        var SYS = require("lib/system");
        
        console.log("현재 사용중인 운영체제: " + SYS.getOS());
    },

    "system_get_architecture": function() {
        var SYS = require("lib/system");
        
        console.log("현재 사용중인 아키텍처: " + SYS.getArch());
    },

    "system_get_uuid": function() {
        var SYS = require("lib/system");

        console.log("디바이스 고유 번호: " + SYS.getUUID());
    },

    "system_get_working_directory": function() {
        var SYS = require("lib/system");

        console.log("현재 작업 폴더: " + SYS.getCurrentWorkingDirectory());
    },

    "system_get_script_directory": function() {
        var SYS = require("lib/system");

        console.log("현재 스크립트 폴더: " + SYS.getCurrentScriptDirectory());
    },

    "system_get_network_interfaces": function() {
        var SYS = require("lib/system");
        
        var net_interfaces = SYS.getNetworkInterfaces();
        console.log(JSON.stringify(net_interfaces));
    },

    "system_get_process_list": function() {
        var SYS = require("lib/system");
        
        var processList = SYS.getProcessList();
        processList.forEach(function(x) {
            console.log(x.Caption, x.ProcessID);
        });
    },

    "system_get_process_list_by_name": function() {
        var SYS = require("lib/system");
        
        var processList = SYS.getProcessListByName("explorer.exe");
        processList.forEach(function(x) {
            console.log(x.Caption, x.ProcessID);
        });
    },

    "system_register_uri": function() {
        console.log("웹 브라우저를 열고 주소창에 아래 주소를 입력하세요.");
        console.log("welsonjs:///?application=mscalc");
    },

    "system_pipe_ipc": function() {
		
	},

    "vhid_find_window": function() {
		var SHELL = require("lib/shell");
		var Toolkit = require("lib/toolkit");
		
		// 메모장 열기
		SHELL.run(["notepad"]);

		// 3초 대기
		sleep(5000);

		// 키 보내기
		Toolkit.sendKeys("제목 없음 - Windows 메모장", "dasdasdasdasasdasdasd");
		console.log("키를 보냈습니다.");
	},

    "vhid_send_click": function() {
		
	},

    "vhid_send_keys": function() {
		
	},

    "vhid_send_key_enter": function() {
		
	},

    "vhid_send_key_functions": function() {
		
	},

    "vhid_alert": function() {
		var Toolkit = require("lib/toolkit");

		Toolkit.alert("잘 보이면 테스트에 성공한 것입니다.");
	},
 
    "vhid_confirm": function() {
		var Toolkit = require("lib/toolkit");
		
		var answer = Toolkit.confirm("예 또는 아니오를 눌러주세요");
		console.log(String(answer));
	},

    "vhid_prompt": function() {
		var Toolkit = require("lib/toolkit");

		var answer = Toolkit.prompt("Enter your input:");
		console.log(String(answer));
	},

    "network_http_get": function() {
		
	},

    "network_http_post": function() {
		
	},

    "network_http_extended": function() {
		
	},

    "network_attach_debugger": function() {
		
	},

    "network_detect_charset": function() {
		
	},

    "network_detect_http_ssl": function() {
		
	},

    "network_send_icmp": function() {
        var SYS = require("lib/system");

        console.log("1.1.1.1로 PING(ICMP) 전송");
        console.log("응답 시간: " + SYS.ping("1.1.1.1") + "ms");
    },

    "extramath_dtm": function() {
        var ExtraMath = require("lib/extramath");
        
        var a = "this is an apple";
        var b = "this is red apple";
        
        var dtm = new ExtraMath.DTM();
        dtm.add(a);
        dtm.add(b);
        var mat = dtm.toArray();

        console.log("Original sentance");
        console.log(a);
        console.log(b);

        console.log("Create a DTM(Document-Term Matrix)");
        console.log(mat[0].join(' '));
        console.log(mat[1].join(' '));
    },

    "extramath_cosine_similarity": function() {
        var ExtraMath = require("lib/extramath");
        
        var a = "this is an apple";
        var b = "this is red apple";

        var dtm = new ExtraMath.DTM();
        dtm.add(a);
        dtm.add(b);
        var mat = dtm.toArray();

        console.log("Original sentance");
        console.log(a);
        console.log(b);

        console.log("Create a DTM(Document-Term Matrix)");
        console.log(mat[0].join(' '));
        console.log(mat[1].join(' '));

        console.log("Measure Cosine Similarity");
        console.log('' + ExtraMath.arrayCos(mat[0], mat[1]));
        console.log('' + ExtraMath.measureSimilarity(a, b));
    },

    "base64_encode": function() {
        var BASE64 = require("lib/base64");
        
        var original_text = "hello world";
        var encoded_text = BASE64.encode(original_text);

        console.log("원문: " + original_text);
        console.log("인코딩된 문자: " + encoded_text);
        
        console.log(encoded_text == "aGVsbG8gd29ybGQ=" ?
            "인코딩된 문자가 기대값과 일치합니다." :
            "인코딩된 문자가 기대값과 불일치합니다.");
    },

    "base64_decode": function() {
        var BASE64 = require("lib/base64");

        var encoded_text = "aGVsbG8gd29ybGQ=";
        var original_text = BASE64.decode(encoded_text);
        
        console.log("인코딩된 문자: " + encoded_text);
        console.log("원문: " + original_text);

        console.log(original_text == "hello world" ?
            "디코드된 문자가 기대값과 일치합니다." :
            "디코드된 문자가 기대값과 불일치합니다.");
    },

    "chromium_run": function() {
		var Chrome = require("lib/chrome");
		Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true);
    },

    "chromium_create_profile": function() {
		
	},

    "chromium_run_incognito": function() {
		var Chrome = require("lib/chrome");
		Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true);
	},

    "chromium_navigate": function() {
		var Chrome = require("lib/chrome");
		var wbInstance = Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true);
		
		console.log("5초 후 구글로 이동합니다.");
		sleep(5000);

		wbInstance.setPageId(null);
		wbInstance.navigate("https://google.com");
	},

    "chromium_get_active_pages": function() {
		var Chrome = require("lib/chrome");
		var wbInstance = Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true);
		
		console.log("5초 후 페이지 목록을 불러옵니다.");
		sleep(5000);

		var pageList = wbInstance.getPageList();
		pageList.forEach(function(x) {
			console.log(x.title);
		});
	},

    "chromium_find_page_by_id": function() {
		var Chrome = require("lib/chrome");
		var wbInstance = Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true);
		
		console.log("5초 후 페이지 ID를 불러옵니다.");
		sleep(5000);

		var pageId = wbInstance.getPageList()[0].id;
		console.log("페이지 ID: " + pageId);

		console.log("페이지 ID로 페이지 찾기");
		var page = wbInstance.getPageById(pageId);

		console.log("페이지 제목: " + page.title);
	},

    "chromium_find_pages_by_title": function() {
		var Chrome = require("lib/chrome");
		var wbInstance = Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true);
		
		console.log("5초 후 페이지 타이틀을 불러옵니다.");
		sleep(5000);

		var pageTitle = wbInstance.getPageList()[0].title;
		console.log("페이지 타이틀: " + pageTitle);

		console.log("페이지 타이틀로 페이지 찾기");
		var pages = wbInstance.getPagesByTitle(pageTitle);   // 타이틀로 찾는 경우 복수형으로 반환됨

		console.log("페이지 ID: " + pages[0].id);
	},

    "chromium_move_focused": function() {
		var Chrome = require("lib/chrome");
		
		var wbInstances = [];
		wbInstances.push(Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true));
		sleep(2000);
		wbInstances.push(Chrome.startDebugInPrivate("https://naver.com", null, "welsonjs_test_2", 9223, true));
		sleep(2000);
		wbInstances.push(Chrome.startDebugInPrivate("https://daum.net", null, "welsonjs_test_3", 9224, true));
		sleep(2000);

		var wbInstance = wbInstances[1];
		wbInstance.setPageId(null);
		wbInstance.focus();
	},

    "chromium_adjust_window_size": function() {},

    "chromium_get_element_position": function() {
		var Chrome = require("lib/chrome");
		var wbInstance = Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true);
		
		console.log("5초 후 명령을 수행합니다.");
		sleep(5000);
		
		console.log(JSON.stringify(wbInstance.getElementPosition("p")));
	},

    "chromium_get_mapreduced_element_position": function() {
		var Chrome = require("lib/chrome");
		var wbInstance = Chrome.startDebugInPrivate("https://example.org", null, "welsonjs_test", 9222, true);
		
		console.log("5초 후 명령을 수행합니다.");
		sleep(5000);

		console.log("More information... 버튼의 위치를 탐색");
		console.log(JSON.stringify(wbInstance.getNestedElementPosition("p", ":self", "More information...")));
	},

    "chromium_set_value_to_textbox": function() {
		
	},

    "chromium_send_click": function() {
		
	},

    "chromium_send_keys": function() {
		
	},

    "chromium_auto_scroll_until_end": function() {
		
	},

    "grpc_run_server": function() {
        var SHELL = require("lib/shell");

        SHELL.show(["cscript", "app.js", "grpcloader"]);
    },

    "grpc_receive_command": function() {
        var SHELL = require("lib/shell");

        SHELL.show(["grpcloader_test.bat"]);
    },

    "gui_check": function() {
		console.log("GUI 환경에서 실행하여 주십시오");
	}
};

function main(args) {
    if (args.length > 0) {
        var test_id = args[0];

        if (test_id in test_implements) {
            var test = profile.tests.find(function(x) {
                return (x.id == test_id);
            });
            var description = test.description;

            console.log("Test ID: " + test_id);
            console.log("Will be test: " + description);

            try {
                test_implements[test_id]();
            } catch (e) {
                console.error("ERROR: " + e.message)
            }

            console.log("Will be close this window after 90 seconds");
            sleep(90 * 1000);
        }
    } else {
        console.log("hello world!");
    }
}

exports.main = main;
