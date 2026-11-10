/**
 * WebMCP (Model Context Protocol for Web Browsers)
 * Exposes structured tools to in-browser AI agents via navigator.modelContext.registerTool
 * and form annotations (SEP-1649 / WebMCP spec).
 */

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  execute: (input: any) => Promise<any> | any;
}

export function initWebMcp(): void {
  if (typeof window === 'undefined') return;

  const tools: WebMcpTool[] = [
    {
      name: 'book_rehabilitation_appointment',
      description: 'حجز موعد تقييم وتشخيص مبكر أو جلسة علاجية في مركز رابا (ABA، تخاطب، تكامل حسي)',
      inputSchema: {
        type: 'object',
        properties: {
          parentName: { type: 'string', description: 'اسم ولي الأمر' },
          phone: { type: 'string', description: 'رقم الهاتف للتواصل' },
          childName: { type: 'string', description: 'اسم الطفل' },
          childAge: { type: 'number', description: 'عمر الطفل بالسنوات' },
          service: { type: 'string', description: 'الخدمة المطلوبة (ABA, Speech, OT, Assessment)' },
          branch: { type: 'string', description: 'الفرع المفضل (الرياض، جدة، الخرج، الخبر، الأحساء)' }
        },
        required: ['parentName', 'phone', 'service']
      },
      execute: async (input: any) => {
        try {
          const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              parentName: input.parentName,
              childName: input.childName || 'طفل مستفيد',
              childAge: String(input.childAge || 4),
              phone: input.phone,
              serviceId: input.service || 'aba-therapy',
              branchId: input.branch || 'riyadh-main',
              status: 'pending',
              createdAt: new Date().toISOString()
            })
          });
          const data = await res.json();
          return { success: true, message: 'تم إرسال طلب الحجز بنجاح', data };
        } catch (err: any) {
          return { success: false, error: err.message || 'حدث خطأ أثناء حجز الموعد' };
        }
      }
    },
    {
      name: 'get_center_services',
      description: 'استعراض خدمات وبرامج مركز رابا العلاجية والتشخيصية وبرنامج سِوار لمعلم الظل',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'تصنيف الخدمة الاختياري (aba, speech, ot, assessment, shadow-teacher)' }
        }
      },
      execute: async () => {
        return {
          center: 'مركز رابا للعلاج بتحليل السلوك التطبيقي ABA والتأهيل الشامل',
          services: [
            {
              id: 'aba',
              name: 'برنامج تحليل السلوك التطبيقي المكثف (ABA)',
              description: 'خطط فردية قائمة على التقييم السلوكي الوظيفي FBA لبناء المهارات وخفض السلوكيات غير المرغوبة.'
            },
            {
              id: 'assessment',
              name: 'التشخيص والتقييم النمائي الشامل',
              description: 'تطبيق مقاييس معتمدة دولياً (VB-MAPP, ABLLS-R, Vineland) لتحديد الاحتياجات الفردية.'
            },
            {
              id: 'speech',
              name: 'جلسات النطق والتخاطب وتطوير التواصل',
              description: 'علاج التأتأة، تأخر النطق، والتدريب على التواصل المعزز والبديل (AAC / PECS).'
            },
            {
              id: 'ot-sensory',
              name: 'العلاج الوظيفي والتكامل الحسي',
              description: 'صالة حسية متطورة لتنظيم المعالجة الحسية وتنمية المهارات الحركية والتآزر.'
            },
            {
              id: 'shadow-teacher',
              name: 'برنامج سِوار – معلم الظل والدمج المدرسي',
              description: 'توفير كفاءات ظل مدربة لمرافقة الطالب وتيسير الدمج الصفي والاجتماعي.'
            }
          ]
        };
      }
    },
    {
      name: 'get_branches_and_contacts',
      description: 'استعلام عن مواقع فروع مركز رابا في المملكة، ساعات العمل، وقنوات التواصل',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      execute: async () => {
        return {
          phone: '+966575100100',
          whatsapp: 'https://wa.me/966575100100',
          email: 'info@rabacenters.com',
          workingHours: 'الأحد - الخميس: 08:00 صباحاً - 06:00 مساءً',
          branches: [
            { name: 'فرع الرياض الرئيسي', city: 'الرياض', street: 'طريق الملك فهد' },
            { name: 'فرع جدة', city: 'جدة' },
            { name: 'فرع الخبر والمنطقة الشرقية', city: 'الخبر' },
            { name: 'فرع الخرج', city: 'الخرج' },
            { name: 'فرع الأحساء', city: 'الأحساء' }
          ]
        };
      }
    }
  ];

  // 1. Standard navigator.modelContext.registerTool API
  const nav = navigator as any;
  if (!nav.modelContext) {
    nav.modelContext = {
      tools: new Map<string, WebMcpTool>(),
      registerTool(tool: WebMcpTool) {
        this.tools.set(tool.name, tool);
      },
      getTools() {
        return Array.from(this.tools.values());
      }
    };
  }

  // Register each tool with the host browser / agent context
  for (const tool of tools) {
    try {
      if (typeof nav.modelContext.registerTool === 'function') {
        nav.modelContext.registerTool(tool);
      }
    } catch (e) {
      console.warn('[WebMCP] Failed to register tool with navigator.modelContext:', tool.name, e);
    }
  }

  // 2. Expose on window for in-browser agents and testing inspectors
  (window as any).__rabaWebMcp = {
    version: '1.0.0',
    tools,
    executeTool: async (name: string, input: any) => {
      const target = tools.find(t => t.name === name);
      if (!target) throw new Error(`WebMCP tool not found: ${name}`);
      return target.execute(input);
    }
  };
}
